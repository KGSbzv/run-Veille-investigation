
import { Case, CaseStatus, CaseFile, CaseEvent, CaseEventType, UserRole } from '../types';

const mockCases: Case[] = [
  { id: '1', title: 'Opération Corbeau Numérique', description: 'Surveillance des activités de désinformation sur les réseaux sociaux visant le processus électoral.', status: CaseStatus.IN_PROGRESS, category: 'Désinformation', tags: ['réseaux sociaux', 'ingérence'], createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:00:00Z', updatedAt: '2023-10-28T14:30:00Z' },
  { id: '2', title: 'Menaces sur Infrastructure Critique', description: 'Analyse des menaces potentielles contre les systèmes de vote électronique.', status: CaseStatus.OPEN, category: 'Cybersecurité', tags: ['infrastructure', 'élection'], createdBy: 'Analyste Bravo', createdAt: '2023-10-27T11:00:00Z', updatedAt: '2023-10-27T11:00:00Z' },
  { id: '3', title: 'Financements Etrangers', description: 'Enquête sur des flux financiers suspects potentiellement liés au financement de campagnes.', status: CaseStatus.CLOSED, category: 'Finance', tags: ['financement', 'transparence'], createdBy: 'Analyste Charlie', createdAt: '2023-09-15T09:00:00Z', updatedAt: '2023-10-20T17:00:00Z' },
];

let mockFiles: { [caseId: string]: CaseFile[] } = {
  '1': [
    { id: 'f1-1', name: 'rapport_veille_oct.pdf', type: 'application/pdf', size: 120450, uploadedAt: '2023-10-26T10:05:00Z', uploadedBy: 'Analyste Alpha' },
    { id: 'f1-2', name: 'screenshot_propagande.png', type: 'image/png', size: 850320, uploadedAt: '2023-10-27T15:20:00Z', uploadedBy: 'Analyste Alpha' },
  ],
  '2': [
    { id: 'f2-1', name: 'analyse_vulnérabilités.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 450100, uploadedAt: '2023-10-28T09:15:00Z', uploadedBy: 'Analyste Bravo' },
  ],
};

const mockEvents: { [caseId: string]: CaseEvent[] } = {
    '1': [
        { id: 'e1-1', type: CaseEventType.STATUS_CHANGE, payload: { old: CaseStatus.OPEN, new: CaseStatus.IN_PROGRESS }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:00:00Z' },
        { id: 'e1-2', type: CaseEventType.FILE_ADDED, payload: { fileName: 'rapport_veille_oct.pdf' }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:05:00Z' },
        { id: 'e1-3', type: CaseEventType.MESSAGE, payload: { author: 'Analyste Alpha', text: 'Début de l\'analyse des sources.' }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:10:00Z' },
    ]
};

const mockKnowledgeChunks: string[] = [
    "Rapport interne 2022: Les campagnes de désinformation russes ciblent souvent les périodes électorales en utilisant des fermes de trolls pour amplifier les récits polarisants.",
    "Directive 03-B: Toute preuve d'ingérence étrangère doit être signalée au niveau supérieur dans les 24 heures.",
    "Analyse post-élection 2022: Le groupe 'Cyber Aigle' a été associé à des tentatives de phishing contre des responsables de campagne."
];

export const getCases = async (): Promise<Case[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockCases), 500));
};

export const getCaseById = async (id: string): Promise<Case | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockCases.find(c => c.id === id)), 300));
};

export const getFilesForCase = async (caseId: string): Promise<CaseFile[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockFiles[caseId] || []), 300));
};

export const getEventsForCase = async (caseId: string): Promise<CaseEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockEvents[caseId] || []), 300));
};

export const getRAGContextForQuery = async (query: string): Promise<string> => {
    // In a real app, this would perform a vector search in pgvector.
    // Here we just return a random chunk.
    return new Promise(resolve => setTimeout(() => resolve(mockKnowledgeChunks.join('\n\n')), 200));
};

export const addFileToCase = async (caseId: string, file: File, base64Content: string): Promise<CaseFile> => {
    const newFile: CaseFile = {
        id: `f${caseId}-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Analyste Alpha', // from auth context
        base64Content: base64Content
    };

    if (!mockFiles[caseId]) {
        mockFiles[caseId] = [];
    }
    mockFiles[caseId].push(newFile);
    return new Promise(resolve => setTimeout(() => resolve(newFile), 500));
};

export const updateFileAnalysis = async (caseId: string, fileId: string, analysis: any): Promise<CaseFile> => {
    const file = mockFiles[caseId]?.find(f => f.id === fileId);
    if (file) {
        file.analysis = analysis;
    }
    return new Promise(resolve => setTimeout(() => resolve(file!), 100));
};

