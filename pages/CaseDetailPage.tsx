import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCaseById, getFilesForCase, addFileToCase, updateFileAnalysis } from '../services/mockDataService';
import { Case, CaseFile, FileAnalysis } from '../types';
import Spinner from '../components/ui/Spinner';
import CaseChat from '../components/chat/CaseChat';
import { analyzeImageWithGemini } from '../services/geminiService';

const FileUpload: React.FC<{ onFileUpload: (file: File, base64: string) => void }> = ({ onFileUpload }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                onFileUpload(file, base64);
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mt-4">
            <label className="w-full flex items-center justify-center px-4 py-2 bg-brand-lightblue text-white rounded-lg cursor-pointer hover:bg-brand-blue">
                {isUploading ? <Spinner size={20} /> : <span>Ajouter un fichier</span>}
                <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} disabled={isUploading}/>
            </label>
        </div>
    );
};


const CaseDetailPage: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [files, setFiles] = useState<CaseFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const [analyzingFileId, setAnalyzingFileId] = useState<string | null>(null);

    useEffect(() => {
        if (!caseId) return;
        const loadData = async () => {
            setLoading(true);
            const [caseDetails, caseFiles] = await Promise.all([
                getCaseById(caseId),
                getFilesForCase(caseId),
            ]);
            setCaseData(caseDetails || null);
            setFiles(caseFiles);
            setLoading(false);
        };
        loadData();
    }, [caseId]);

    const handleFileUpload = async (file: File, base64: string) => {
        if (!caseId) return;
        const newFile = await addFileToCase(caseId, file, base64);
        setFiles(prevFiles => [...prevFiles, newFile]);
    };

    const handleAnalyzeFile = async (file: CaseFile) => {
        if (!file.base64Content || !file.type.startsWith('image/')) {
            alert("L'analyse n'est possible que pour les images uploadées pendant cette session.");
            return;
        }
        setAnalyzingFileId(file.id);
        const prompt = "Analyse cette image dans le contexte d'une enquête de sécurité. Décris les objets, personnes, lieux et identifie les points de vigilance potentiels. Formatte la réponse en JSON avec les clés 'summary', 'entities', et 'risks'.";
        const resultText = await analyzeImageWithGemini(file.base64Content, file.type, prompt);
        
        try {
            const resultJson: FileAnalysis = JSON.parse(resultText);
            await updateFileAnalysis(caseId!, file.id, resultJson);
            setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? {...f, analysis: resultJson} : f));
        } catch(e) {
            console.error("Failed to parse Gemini response as JSON", e);
            const fallbackAnalysis: FileAnalysis = { summary: resultText, entities: ["N/A"], risks: ["N/A"] };
            await updateFileAnalysis(caseId!, file.id, fallbackAnalysis);
            setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? {...f, analysis: fallbackAnalysis} : f));
        }

        setAnalyzingFileId(null);
    };

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner size={48} /></div>;
    if (!caseData) return <div className="text-center text-dark-text-secondary">Dossier non trouvé.</div>;

    const TabButton: React.FC<{tabName: string; label: string}> = ({tabName, label}) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium ${activeTab === tabName ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-dark-text-secondary'}`}>
            {label}
        </button>
    )

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text">{caseData.title}</h1>
            <p className="mt-1 text-dark-text-secondary">{caseData.description}</p>
            <div className="mt-6 border-b border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton tabName="chat" label="Chat d'Enquête" />
                    <TabButton tabName="files" label="Fichiers" />
                    <TabButton tabName="timeline" label="Timeline" />
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'chat' && <CaseChat />}
                {activeTab === 'files' && (
                    <div className="bg-dark-card p-4 rounded-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Fichiers du dossier</h2>
                         <ul className="space-y-3">
                            {files.map(file => (
                                <li key={file.id} className="p-3 bg-gray-800 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-dark-text">{file.name}</p>
                                        <p className="text-xs text-dark-text-secondary">{(file.size / 1024).toFixed(1)} KB - {file.type}</p>
                                        {file.analysis && (
                                            <div className="mt-2 p-2 border-l-2 border-brand-accent bg-gray-900 text-xs">
                                                <p><strong>Résumé:</strong> {file.analysis.summary}</p>
                                                <p><strong>Entités:</strong> {file.analysis.entities.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAnalyzeFile(file)}
                                        disabled={analyzingFileId === file.id || !!file.analysis}
                                        className="px-3 py-1 text-xs bg-brand-lightblue text-white rounded-md hover:bg-brand-blue disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {analyzingFileId === file.id ? <Spinner size={16} /> : (file.analysis ? 'Analysé' : 'Analyser')}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <FileUpload onFileUpload={handleFileUpload} />
                    </div>
                )}
                {activeTab === 'timeline' && <div className="text-dark-text-secondary">Timeline à implémenter.</div>}
            </div>
        </div>
    );
};

export default CaseDetailPage;