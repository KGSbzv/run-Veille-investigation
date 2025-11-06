import { useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  spotlightPadding?: number;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'dashboard',
    title: 'Tableau de bord',
    description: 'Visualisez les statistiques clés et les tendances de vos affaires de surveillance.',
    target: '[data-tour="dashboard"]',
    placement: 'bottom',
  },
  {
    id: 'cases',
    title: 'Gestion des affaires',
    description: 'Créez et gérez vos affaires de surveillance. Suivez leur progression et ajoutez des notes.',
    target: '[data-tour="cases"]',
    placement: 'bottom',
  },
  {
    id: 'watchlists',
    title: 'Listes de surveillance',
    description: 'Gérez vos listes de surveillance avec des mots-clés et sources pour une veille efficace.',
    target: '[data-tour="watchlists"]',
    placement: 'bottom',
  },
  {
    id: 'chat',
    title: 'Assistant IA',
    description: 'Utilisez l\'assistant IA pour analyser des informations et obtenir des insights.',
    target: '[data-tour="chat"]',
    placement: 'left',
  },
  {
    id: 'profile',
    title: 'Profil utilisateur',
    description: 'Accédez à vos paramètres et déconnexion depuis votre profil.',
    target: '[data-tour="profile"]',
    placement: 'bottom',
  },
];

const STORAGE_KEY = 'onboarding_completed';

export const useOnboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (completed === 'true') {
      setIsCompleted(true);
    }
  }, []);

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setIsCompleted(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsCompleted(false);
    setIsActive(false);
    setCurrentStepIndex(0);
  }, []);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps: ONBOARDING_STEPS.length,
    progress,
    isCompleted,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    resetTour,
  };
};
