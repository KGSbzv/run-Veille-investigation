import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('analyste@cacrs.gouv.fr');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { user, login } = useAuth();

  // Si l'utilisateur est déjà connecté, le rediriger vers le tableau de bord
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSigningIn(true);
    // Simule un appel réseau
    setTimeout(() => {
        login(email);
        setIsSigningIn(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-dark-card rounded-lg shadow-lg border border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-dark-text">
            CACRS - Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-dark-text-secondary">
            Plateforme de Veille & Investigation
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm">
                <div>
                <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-dark-text placeholder-gray-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md"
                    placeholder="Adresse e-mail (ex: nyh770@gmail.com pour admin)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={isSigningIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-lightblue hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-gray-900 disabled:opacity-50"
                >
                {isSigningIn ? <Spinner size={20}/> : 'Se connecter'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;