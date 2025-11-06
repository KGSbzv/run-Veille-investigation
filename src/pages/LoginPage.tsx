import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import { ShieldCheckIcon } from '../components/ui/Icons';

const LoginPage: React.FC = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    // Abort if user is logged in or the button container isn't rendered yet
    if (user || !googleButtonRef.current) {
      return;
    }
    
    // Check if the Google Identity Services library is loaded
    // @ts-ignore
    if (typeof google === 'undefined' || !google.accounts) {
      console.warn("Le script Google Identity Services n'est pas encore chargé.");
      // Optional: implement a retry mechanism or show an error to the user
      return;
    }

    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID not configured. Please set it in .env.local");
        return;
      }
      
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: clientId,
        callback: loginWithGoogle,
        auto_select: true, // Automatically sign in the user if they have a session
      });
      
      // Render the Google Sign-In button
      // @ts-ignore
      google.accounts.id.renderButton(
        googleButtonRef.current,
        { 
          theme: "outline", 
          size: "large", 
          text: "continue_with", 
          shape: "rectangular", 
          logo_alignment: "left", 
          width: "320" 
        }
      );

      // Display the One Tap prompt for returning users
      // @ts-ignore
      google.accounts.id.prompt();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Google Identity Services:", error);
    }

  // Rerun effect if the user logs out
  }, [user, loginWithGoogle]);

  // While redirecting after login, show a spinner
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-card rounded-lg shadow-2xl border border-gray-700 animate-fade-in">
        <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-brand-accent" />
            <h2 className="mt-4 text-3xl font-extrabold text-dark-text">
                Portail CACRS
            </h2>
            <p className="mt-2 text-sm text-dark-text-secondary">
                Plateforme de Veille & d'Investigation
            </p>
        </div>
        <div className="flex flex-col items-center justify-center pt-4">
            <p className="text-sm text-dark-text-secondary mb-4">Veuillez vous authentifier pour continuer.</p>
            <div id="google-signin-button" ref={googleButtonRef} className="h-[40px]">
                {/* Google button will be rendered here. The container needs a defined height. */}
            </div>
            <p className="mt-4 text-xs text-dark-text-secondary/70">
                Authentification sécurisée gérée par Google.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
