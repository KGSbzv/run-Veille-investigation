
import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-end items-center p-4 bg-dark-card border-b border-gray-700">
           <div className="flex items-center space-x-4">
              <span className="text-sm text-dark-text-secondary">{user?.email}</span>
              <button onClick={logout} className="text-sm text-brand-accent hover:underline">Déconnexion</button>
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
