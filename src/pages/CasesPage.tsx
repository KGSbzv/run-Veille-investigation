import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCases, addCase, updateCaseStatus, deleteCase } from '../services/mockDataService';
import { Case, CaseStatus } from '../types';
import Spinner from '../components/ui/Spinner';
import { PlusCircleIcon, DownloadIcon, XIcon, MoreVerticalIcon, PlayIcon, CheckCircle2Icon, ArchiveIcon } from '../components/ui/Icons';
import NewCaseModal from '../components/cases/NewCaseModal';
import { exportToCsv, exportToJson } from '../utils/exportUtils';

const CaseStatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const color = {
    [CaseStatus.OPEN]: 'bg-blue-500',
    [CaseStatus.IN_PROGRESS]: 'bg-yellow-500',
    [CaseStatus.CLOSED]: 'bg-green-500',
  }[status];
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}>{status}</span>;
};

const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const data = await getCases();
      setCases(data);
      setLoading(false);
    };
    fetchCases();
  }, []);

  const filteredCases = useMemo(() => {
    if (!searchQuery) {
      return cases;
    }
    return cases.filter(c => {
      const query = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [cases, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleCreateCase = async (caseData: Omit<Case, 'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    const newCase = await addCase(caseData);
    setCases(prevCases => [newCase, ...prevCases]);
    setIsModalOpen(false);
  };

  const handleStatusChange = async (caseId: string, newStatus: CaseStatus) => {
    const updatedCase = await updateCaseStatus(caseId, newStatus);
    if(updatedCase) {
      setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
    }
    setActiveMenuId(null);
  }

  const handleArchive = async (caseId: string) => {
    await deleteCase(caseId);
    setCases(prev => prev.filter(c => c.id !== caseId));
    setActiveMenuId(null);
  }

  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = filteredCases; // Export only filtered cases
    const date = new Date().toISOString().split('T')[0];
    const filename = `export_dossiers_${date}`;
    if (format === 'csv') {
        const dataForCsv = dataToExport.map(c => ({
            ...c,
            tags: c.tags.join('; '),
        }));
        exportToCsv(dataForCsv, filename);
    } else {
        exportToJson(dataToExport, filename);
    }
    setIsExportMenuOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner size={48}/></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Dossiers d'enquête</h1>
        <div className="flex items-center gap-2">
            <div className="relative" ref={exportMenuRef}>
                 <button 
                    onClick={() => setIsExportMenuOpen(prev => !prev)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-dark-text-secondary rounded-lg hover:bg-gray-600 transition-colors"
                 >
                    <DownloadIcon className="w-5 h-5" />
                    Exporter
                 </button>
                 {isExportMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-gray-700 rounded-md shadow-lg z-10 animate-fade-in">
                        <button onClick={() => handleExport('csv')} className="block w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-800">Exporter en CSV</button>
                        <button onClick={() => handleExport('json')} className="block w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-800">Exporter en JSON</button>
                    </div>
                 )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-lightblue text-white rounded-lg hover:bg-brand-blue transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Nouveau Dossier
            </button>
        </div>
      </div>
      
      {searchQuery && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg flex justify-between items-center animate-fade-in">
            <p className="text-sm text-dark-text-secondary">
                {filteredCases.length} résultat(s) pour : <span className="font-semibold text-dark-text">"{searchQuery}"</span>
            </p>
            <button
                onClick={() => setSearchParams({})}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-dark-card text-dark-text-secondary rounded-md hover:bg-gray-700 transition-colors"
            >
                <XIcon className="w-4 h-4" />
                Effacer
            </button>
        </div>
      )}

      <div className="bg-dark-card border border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Titre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Catégorie</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Tags</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Dernière MàJ</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-dark-card divide-y divide-gray-700">
            {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/cases/${caseItem.id}`} className="text-sm font-medium text-brand-accent hover:underline">{caseItem.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CaseStatusBadge status={caseItem.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">{caseItem.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {caseItem.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-gray-700 text-dark-text-secondary rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">{new Date(caseItem.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block text-left" ref={activeMenuId === caseItem.id ? actionMenuRef : null}>
                            <button
                                onClick={() => setActiveMenuId(activeMenuId === caseItem.id ? null : caseItem.id)}
                                className="p-2 rounded-full hover:bg-gray-700 text-dark-text-secondary hover:text-dark-text"
                            >
                                <MoreVerticalIcon className="w-5 h-5" />
                            </button>
                            {activeMenuId === caseItem.id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-dark-card border border-gray-700 ring-1 ring-black ring-opacity-5 z-10 animate-fade-in">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        {caseItem.status !== CaseStatus.IN_PROGRESS && (
                                          <button onClick={() => handleStatusChange(caseItem.id, CaseStatus.IN_PROGRESS)} className="w-full text-left flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-800 hover:text-dark-text" role="menuitem">
                                            <PlayIcon className="w-4 h-4 mr-3" />
                                            Marquer comme 'En cours'
                                          </button>
                                        )}
                                        {caseItem.status !== CaseStatus.CLOSED && (
                                          <button onClick={() => handleStatusChange(caseItem.id, CaseStatus.CLOSED)} className="w-full text-left flex items-center px-4 py-2 text-sm text-dark-text-secondary hover:bg-gray-800 hover:text-dark-text" role="menuitem">
                                             <CheckCircle2Icon className="w-4 h-4 mr-3" />
                                            Marquer comme 'Fermé'
                                          </button>
                                        )}
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <button onClick={() => handleArchive(caseItem.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300" role="menuitem">
                                            <ArchiveIcon className="w-4 h-4 mr-3" />
                                            Archiver
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                  </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-dark-text-secondary">
                        {searchQuery ? 'Aucun dossier ne correspond à votre recherche.' : 'Aucun dossier à afficher.'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      <NewCaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};

export default CasesPage;