import React, { createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import WatchlistsPage from './pages/WatchlistsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import OnboardingTour from './components/ui/OnboardingTour';

const OnboardingContext = createContext<ReturnType<typeof useOnboarding> | null>(null);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};

const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const onboarding = useOnboarding();
  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
      <OnboardingTour />
    </OnboardingContext.Provider>
  );
};

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cases" element={<CasesPage />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
              <Route path="/watchlists" element={<WatchlistsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;