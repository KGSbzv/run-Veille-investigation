import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { getWebSearchResults } from '../services/geminiService';
import { GroundingSource } from '../types';

const WatchlistsPage: React.FC = () => {
    const [query, setQuery] = useState("Dernières nouvelles sur l'élection 2026");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{text: string, sources: GroundingSource[]}|null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        const searchResult = await getWebSearchResults(query);
        setResult(searchResult);
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text mb-6">Veille & Findings (Recherche Web)</h1>
            <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
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
                    <div className="mt-6 border-t border-gray-700 pt-6">
                         <h3 className="text-lg font-semibold text-dark-text mb-2">Résultat de la recherche</h3>
                         <div className="prose prose-invert prose-p:text-dark-text-secondary max-w-none">
                            <p>{result.text}</p>
                         </div>
                         
                         {result.sources.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-md font-semibold text-dark-text mb-2">Sources</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
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
    );
};

export default WatchlistsPage;