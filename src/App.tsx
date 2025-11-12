import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserRole } from './types';
import Spinner from './components/ui/Spinner';
import { OnboardingProvider } from './hooks/useOnboarding';

// Lazy load components for better performance
const Layout = lazy(() => import('./components/layout/Layout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CasesPage = lazy(() => import('./pages/CasesPage'));
const CaseDetailPage = lazy(() => import('./pages/CaseDetailPage'));
const WatchlistsPage = lazy(() => import('./pages/WatchlistsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminServicesSettings = lazy(() => import('./pages/AdminServicesSettings'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingTour = lazy(() => import('./components/onboarding/OnboardingTour'));

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
    <Suspense fallback={<FullScreenSpinner />}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  );
};

const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== UserRole.ADMIN) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <FullScreenSpinner />;
  }

  return element;
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
              <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
              <Route path="/admin/services" element={<AdminRoute element={<AdminServicesSettings />} />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HashRouter>
        <OnboardingTour />
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
