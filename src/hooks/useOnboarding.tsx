import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

const ONBOARDING_STORAGE_KEY = 'cacrs-onboarding-completed';

interface OnboardingContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!hasCompleted) {
        setIsTourActive(true);
      }
    } catch (error) {
      console.error("Could not access localStorage for onboarding check:", error);
    }
  }, []);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsTourActive(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourActive(false);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (error) {
      console.error("Could not set onboarding completion flag in localStorage:", error);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);


  return (
    <OnboardingContext.Provider value={{ isTourActive, currentStepIndex, startTour, stopTour, nextStep, prevStep, goToStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
