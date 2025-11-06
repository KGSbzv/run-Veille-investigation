
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useOnboardingContext } from '../../App';
import OnboardingButton from '../ui/OnboardingButton';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isCompleted, startTour } = useOnboardingContext();
  
  useEffect(() => {
    if (user && !isCompleted) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isCompleted, startTour]);
  
  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-end items-center p-4 bg-dark-card border-b border-gray-700">
           <div className="flex items-center space-x-4" data-tour="profile">
              <span className="text-sm text-dark-text-secondary">{user?.email}</span>
              <button onClick={logout} className="text-sm text-brand-accent hover:underline">Déconnexion</button>
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <OnboardingButton />
      </div>
    </div>
  );
};

export default Layout;
