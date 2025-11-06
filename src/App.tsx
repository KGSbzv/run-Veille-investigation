import React from 'react';
import { HashRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import WatchlistsPage from './pages/WatchlistsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Spinner from './components/ui/Spinner';
import { OnboardingProvider } from './hooks/useOnboarding';
import OnboardingTour from './components/onboarding/OnboardingTour';

const FullScreenSpinner: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <Spinner size={48} />
    </div>
);

const ProtectedLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <FullScreenSpinner />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const HomeRedirect: React.FC = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/dashboard', { replace: true });
    }, [navigate]);
    return <FullScreenSpinner />;
};

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cases" element={<CasesPage />} />
              <Route path="/cases/:caseId" element={<CaseDetailPage />} />
              <Route path="/watchlists" element={<WatchlistsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </HashRouter>
        <OnboardingTour />
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
