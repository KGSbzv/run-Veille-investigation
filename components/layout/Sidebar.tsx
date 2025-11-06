
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, FolderIcon, EyeIcon, SettingsIcon } from '../ui/Icons';

const Sidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-lightblue text-white'
        : 'text-dark-text-secondary hover:bg-dark-card hover:text-dark-text'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 bg-dark-card border-r border-gray-800 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold text-white tracking-wider">CACRS</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" className={navLinkClass}>
          <HomeIcon className="w-5 h-5 mr-3" />
          Tableau de bord
        </NavLink>
        <NavLink to="/cases" className={navLinkClass}>
          <FolderIcon className="w-5 h-5 mr-3" />
          Dossiers d'enquête
        </NavLink>
        <NavLink to="/watchlists" className={navLinkClass}>
          <EyeIcon className="w-5 h-5 mr-3" />
          Veille & Findings
        </NavLink>
      </nav>
      <div className="mt-auto">
        <NavLink to="/admin" className={navLinkClass}>
          <SettingsIcon className="w-5 h-5 mr-3" />
          Administration
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
