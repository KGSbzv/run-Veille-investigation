
import React from 'react';
import { FolderIcon, EyeIcon } from '../components/ui/Icons';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <FolderIcon className="w-8 h-8 text-brand-accent" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-dark-text">Dossiers Actifs</p>
              <p className="text-3xl font-bold text-white">2</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <EyeIcon className="w-8 h-8 text-brand-accent" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-dark-text">Nouveaux Findings</p>
              <p className="text-3xl font-bold text-white">127</p>
              <p className="text-sm text-dark-text-secondary">Dernières 24h</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-dark-card p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-dark-text mb-4">Activité récente</h2>
        <ul className="space-y-4">
            <li className="text-dark-text-secondary">Mise à jour du dossier 'Opération Corbeau Numérique'.</li>
            <li className="text-dark-text-secondary">Nouveau fichier 'screenshot_propagande.png' ajouté.</li>
            <li className="text-dark-text-secondary">Veille 'Election 2026' exécutée.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
