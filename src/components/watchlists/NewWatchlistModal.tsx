import React, { useState } from 'react';
import { Watchlist } from '../../types';
import { XIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

interface NewWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (watchlistData: Omit<Watchlist, 'id' | 'lastRun'>) => Promise<void>;
  query: string;
}

const NewWatchlistModal: React.FC<NewWatchlistModalProps> = ({ isOpen, onClose, onSubmit, query }) => {
  const [name, setName] = useState('');
  const [refreshIntervalMinutes, setRefreshIntervalMinutes] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    
    await onSubmit({
        name,
        query,
        refreshIntervalMinutes,
    });

    setIsSubmitting(false);
    setName('');
    setRefreshIntervalMinutes(10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-dark-card rounded-lg shadow-xl w-full max-w-lg border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-dark-text">Créer une Nouvelle Veille</h2>
          <button onClick={onClose} className="text-dark-text-secondary hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary mb-1">Nom de la veille</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Veille sur les activités de 'Cyber Aigle'"
                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
              />
            </div>

            <div>
              <label htmlFor="query" className="block text-sm font-medium text-dark-text-secondary mb-1">Requête de recherche</label>
              <p className="block w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-dark-text-secondary sm:text-sm rounded-md">{query}</p>
            </div>

            <div>
              <label htmlFor="refreshInterval" className="block text-sm font-medium text-dark-text-secondary mb-1">Intervalle de rafraîchissement</label>
              <select
                id="refreshInterval"
                value={refreshIntervalMinutes}
                onChange={(e) => setRefreshIntervalMinutes(Number(e.target.value))}
                className="appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-dark-text focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 heure</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-dark-text-secondary rounded-md hover:bg-gray-700 mr-2">
                Annuler
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-32 px-4 py-2 bg-brand-lightblue text-white text-sm font-medium rounded-md hover:bg-brand-blue disabled:bg-gray-600"
            >
                {isSubmitting ? <Spinner size={20} /> : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWatchlistModal;