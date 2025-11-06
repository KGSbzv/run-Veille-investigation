import React, { useState, useEffect } from 'react';
import Spinner from '../components/ui/Spinner';
import { getWebSearchResults } from '../services/geminiService';
import { getFindings, addFinding, deleteFinding, deleteMultipleFindings, getWatchlists, addWatchlist } from '../services/mockDataService';
import { GroundingSource, Finding, Watchlist } from '../types';
import { BookmarkIcon, XIcon, TrashIcon, PlusCircleIcon, ClockIcon, PlayIcon } from '../components/ui/Icons';
import NewWatchlistModal from '../components/watchlists/NewWatchlistModal';

const WatchlistsPage: React.FC = () => {
    const [query, setQuery] = useState("Dernières nouvelles sur l'élection 2026");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{text: string, sources: GroundingSource[]}|null>(null);

    const [savedFindings, setSavedFindings] = useState<Finding[]>([]);
    const [loadingFindings, setLoadingFindings] = useState(true);
    const [selectedFindingIds, setSelectedFindingIds] = useState<Set<string>>(new Set());

    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [loadingWatchlists, setLoadingWatchlists] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFindings = async () => {
            setLoadingFindings(true);
            const findings = await getFindings();
            setSavedFindings(findings);
            setLoadingFindings(false);
        };
        fetchFindings();

        const fetchWatchlists = async () => {
            setLoadingWatchlists(true);
            const data = await getWatchlists();
            setWatchlists(data);
            setLoadingWatchlists(false);
        };
        fetchWatchlists();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        const searchResult = await getWebSearchResults(query);
        setResult(searchResult);
        setLoading(false);
    };

    const handleSaveFinding = async () => {
        if (!result) return;
        const newFinding = await addFinding({
            query,
            text: result.text,
            sources: result.sources,
        });
        setSavedFindings(prev => [newFinding, ...prev]);
        // Prompt user to create a watchlist from the new finding
        setIsModalOpen(true);
    };

    const handleDeleteFinding = async (id: string) => {
        await deleteFinding(id);
        setSavedFindings(prev => prev.filter(f => f.id !== id));
        setSelectedFindingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };
    
    const handleToggleSelect = (id: string) => {
        setSelectedFindingIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const areAllSelected = savedFindings.length > 0 && selectedFindingIds.size === savedFindings.length;

    const handleSelectAll = () => {
        if (areAllSelected) {
            setSelectedFindingIds(new Set());
        } else {
            setSelectedFindingIds(new Set(savedFindings.map(f => f.id)));
        }
    };

    const handleDeleteSelected = async () => {
        const idsToDelete = Array.from(selectedFindingIds);
        await deleteMultipleFindings(idsToDelete);
        setSavedFindings(prev => prev.filter(f => !selectedFindingIds.has(f.id)));
        setSelectedFindingIds(new Set());
    };

    const handleCreateWatchlist = async (watchlistData: Omit<Watchlist, 'id' | 'lastRun'>) => {
        const newWatchlist = await addWatchlist(watchlistData);
        setWatchlists(prev => [newWatchlist, ...prev]);
        setIsModalOpen(false);
        setResult(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setResult(null); // Clear the search result when closing the modal without creating a watchlist
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text mb-6">Veille & Findings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search Column */}
                <div>
                    <div className="bg-dark-card p-6 rounded-lg border border-gray-700 sticky top-8">
                        <h2 className="text-xl font-semibold text-dark-text mb-4">Lancer une recherche d'actualité</h2>
                        <form onSubmit={handleSearch} className="flex space-x-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-grow bg-gray-800 border border-gray-600 text-dark-text rounded-md px-3 py-2 focus:ring-brand-accent focus:border-brand-accent"
                                placeholder="Entrez votre requête de veille..."
                            />
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-lightblue text-white rounded-lg hover:bg-brand-blue disabled:bg-gray-600 flex items-center justify-center w-28">
                                {loading ? <Spinner size={20} /> : 'Rechercher'}
                            </button>
                        </form>
        
                        {result && (
                            <div className="mt-6 border-t border-gray-700 pt-6 animate-fade-in">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-dark-text">Résultat de la recherche</h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleSaveFinding}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-lightblue text-white rounded-lg hover:bg-brand-blue"
                                        >
                                            <BookmarkIcon className="w-4 h-4" />
                                            Sauvegarder
                                        </button>
                                         <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-600"
                                        >
                                            <PlusCircleIcon className="w-4 h-4" />
                                            Créer une veille
                                        </button>
                                    </div>
                                </div>
                                <div className="prose prose-sm prose-invert prose-p:text-dark-text-secondary max-w-none">
                                    <p>{result.text}</p>
                                </div>
                                
                                {result.sources.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-md font-semibold text-dark-text mb-2">Sources</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.sources.map((source, index) => (
                                                <li key={index} className="text-sm">
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline break-all">
                                                        {source.title || source.uri}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h2 className="text-xl font-semibold text-dark-text mb-4">Veilles Automatisées</h2>
                    {loadingWatchlists ? (
                        <div className="flex justify-center pt-10"><Spinner size={32} /></div>
                    ) : (
                        <div className="space-y-4">
                            {watchlists.length > 0 ? (
                                watchlists.map(wl => (
                                    <div key={wl.id} className="bg-dark-card p-4 rounded-lg border border-gray-700 animate-fade-in">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-dark-text">{wl.name}</p>
                                                <p className="text-sm text-dark-text-secondary mt-1">"{wl.query}"</p>
                                            </div>
                                            <button className="p-2 text-dark-text-secondary hover:text-brand-accent" title="Lancer la recherche maintenant">
                                                <PlayIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center text-xs text-dark-text-secondary/70 mt-3">
                                            <ClockIcon className="w-3 h-3 mr-1.5" />
                                            <span>Toutes les {wl.refreshIntervalMinutes} minutes</span>
                                            <span className="mx-2">·</span>
                                            <span>Dernière exécution: {new Date(wl.lastRun).toLocaleTimeString('fr-FR')}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-dark-card rounded-lg border border-dashed border-gray-700">
                                    <p className="text-dark-text-secondary">Aucune veille automatisée.</p>
                                    <p className="text-xs text-dark-text-secondary/70 mt-1">Créez-en une à partir d'un résultat de recherche.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="my-8 border-t border-gray-700"></div>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-dark-text">Findings Sauvegardés</h2>
                        {savedFindings.length > 0 && (
                             <button 
                                 onClick={handleSelectAll}
                                 className="px-3 py-1.5 text-xs font-medium text-dark-text-secondary rounded-md hover:bg-dark-card/50 hover:text-dark-text transition-colors"
                             >
                                 {areAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                             </button>
                        )}
                    </div>

                    {selectedFindingIds.size > 0 && (
                        <div className="bg-brand-lightblue/20 border border-brand-lightblue/50 text-brand-accent p-3 rounded-lg mb-4 flex justify-between items-center animate-fade-in">
                            <p className="text-sm font-semibold">{selectedFindingIds.size} finding(s) sélectionné(s)</p>
                             <button 
                                 onClick={handleDeleteSelected}
                                 className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-800/80 text-red-100 rounded-lg hover:bg-red-700/80"
                             >
                                 <TrashIcon className="w-4 h-4" />
                                 Supprimer
                             </button>
                        </div>
                    )}

                    {loadingFindings ? (
                        <div className="flex justify-center pt-10"><Spinner size={32} /></div>
                    ) : (
                        <div className="space-y-4">
                            {savedFindings.length > 0 ? (
                                savedFindings.map(finding => {
                                    const isSelected = selectedFindingIds.has(finding.id);
                                    return (
                                        <div 
                                            key={finding.id} 
                                            className={`bg-dark-card rounded-lg border relative group animate-fade-in transition-colors ${isSelected ? 'border-brand-accent shadow-lg' : 'border-gray-700'}`}
                                        >
                                            <button
                                                onClick={() => handleDeleteFinding(finding.id)}
                                                className="absolute top-3 right-3 text-dark-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                aria-label="Supprimer le finding"
                                            >
                                                <XIcon className="w-5 h-5"/>
                                            </button>

                                            <div className="flex gap-4 p-4">
                                                <div className="flex-shrink-0 pt-0.5">
                                                     <input
                                                         type="checkbox"
                                                         checked={isSelected}
                                                         onChange={() => handleToggleSelect(finding.id)}
                                                         className="form-checkbox h-5 w-5 bg-gray-800 border-gray-600 text-brand-accent rounded focus:ring-brand-accent focus:ring-offset-dark-card"
                                                         aria-label={`Sélectionner le finding "${finding.query}"`}
                                                     />
                                                </div>

                                                <div className="flex-grow">
                                                    <p className="text-xs text-dark-text-secondary mb-2">
                                                        Recherche: <span className="font-semibold text-dark-text">"{finding.query}"</span>
                                                    </p>
                                                    <div className="prose prose-sm prose-invert max-w-none prose-p:text-dark-text-secondary">
                                                        <p>{finding.text}</p>
                                                    </div>
                                                    {finding.sources.length > 0 && (
                                                        <div className="mt-3 border-t border-gray-700 pt-3">
                                                            <h4 className="text-xs font-semibold text-dark-text mb-1.5">Sources</h4>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {finding.sources.map((source, index) => (
                                                                    <li key={index} className="text-sm">
                                                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline break-all">
                                                                            {source.title || source.uri}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <p className="text-right text-xs text-dark-text-secondary/50 mt-3">
                                                        {new Date(finding.savedAt).toLocaleString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-10 bg-dark-card rounded-lg border border-dashed border-gray-700">
                                    <p className="text-dark-text-secondary">Aucun finding sauvegardé.</p>
                                    <p className="text-xs text-dark-text-secondary/70 mt-1">Utilisez la recherche pour trouver et sauvegarder des informations pertinentes.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {result && (
                <NewWatchlistModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleCreateWatchlist}
                    query={query}
                />
            )}
        </div>
    );
};

export default WatchlistsPage;