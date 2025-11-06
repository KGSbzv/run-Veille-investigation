import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, FolderIcon, EyeIcon, SettingsIcon, SearchIcon } from '../ui/Icons';

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/cases?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSearch} className="px-1 my-4 relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un dossier..."
                className="w-full bg-gray-700/50 border border-gray-600 text-dark-text-secondary placeholder-gray-500 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </form>
    );
};

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
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={navLinkClass} data-tour-id="dashboard-nav">
          <HomeIcon className="w-5 h-5 mr-3" />
          Tableau de bord
        </NavLink>
        <NavLink to="/cases" className={navLinkClass} data-tour-id="cases-nav">
          <FolderIcon className="w-5 h-5 mr-3" />
          Dossiers d'enquête
        </NavLink>
        <NavLink to="/watchlists" className={navLinkClass} data-tour-id="watchlists-nav">
          <EyeIcon className="w-5 h-5 mr-3" />
          Veille & Findings
        </NavLink>
      </nav>

      <GlobalSearch />

      <div className="mt-auto flex-1 flex flex-col justify-end">
        <NavLink to="/admin" className={navLinkClass}>
          <SettingsIcon className="w-5 h-5 mr-3" />
          Administration
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;