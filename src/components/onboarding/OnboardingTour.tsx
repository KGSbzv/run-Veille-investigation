import React, { useState, useLayoutEffect } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { XIcon } from '../ui/Icons';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour-id="dashboard-nav"]',
    title: "Tableau de Bord",
    content: "C'est ici que vous trouverez une vue d'ensemble de l'activité, des dossiers actifs et des derniers renseignements collectés.",
    position: 'right',
  },
  {
    target: '[data-tour-id="cases-nav"]',
    title: "Dossiers d'Enquête",
    content: "Le cœur de l'application. Gérez toutes vos enquêtes, ajoutez des fichiers et collaborez avec l'assistant IA.",
    position: 'right',
  },
  {
    target: '[data-tour-id="watchlists-nav"]',
    title: "Veille & Findings",
    content: "Effectuez des recherches web ciblées avec l'aide de Gemini et sauvegardez les informations pertinentes ('findings') pour vos enquêtes.",
    position: 'right',
  },
   {
    target: '[data-tour-id="user-profile"]',
    title: "Votre Compte",
    content: "Vous trouverez ici votre e-mail et le bouton pour vous déconnecter de la plateforme.",
    position: 'left',
  },
];

const OnboardingTour: React.FC = () => {
  const { isTourActive, currentStepIndex, stopTour, nextStep, prevStep } = useOnboarding();
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  
  const step = tourSteps[currentStepIndex];

  useLayoutEffect(() => {
    if (isTourActive && step) {
      const element = document.querySelector<HTMLElement>(step.target);
      setHighlightedElement(element);

      if (element) {
        const rect = element.getBoundingClientRect();
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        const popoverPos: React.CSSProperties = {};
        const position = step.position || 'bottom';
        const offset = 12;

        if (position === 'right') {
            popoverPos.top = rect.top;
            popoverPos.left = rect.right + offset;
        } else if (position === 'left') {
            popoverPos.top = rect.top;
            popoverPos.left = rect.left - offset;
            popoverPos.transform = 'translateX(-100%)';
        } else if (position === 'top') {
            popoverPos.top = rect.top - offset;
            popoverPos.left = rect.left;
            popoverPos.transform = 'translateY(-100%)';
        } else { // bottom
            popoverPos.top = rect.bottom + offset;
            popoverPos.left = rect.left;
        }
        setPopoverStyle(popoverPos);
      }
    } else {
      setHighlightedElement(null);
    }
  }, [isTourActive, currentStepIndex, step]);

  if (!isTourActive || !step) {
    return null;
  }
  
  const highlightRect = highlightedElement?.getBoundingClientRect();

  return (
    <div className="onboarding-overlay">
      {highlightRect && (
        <div className="onboarding-highlight" style={{
            width: highlightRect.width + 12,
            height: highlightRect.height + 12,
            top: highlightRect.top - 6,
            left: highlightRect.left - 6,
        }}/>
      )}
      
      <div className="onboarding-popover" style={popoverStyle}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-dark-text">{step.title}</h3>
            <button onClick={stopTour} className="text-dark-text-secondary hover:text-white">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
        <p className="text-sm text-dark-text-secondary mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs text-dark-text-secondary/70">{currentStepIndex + 1} / {tourSteps.length}</span>
            <div>
                {currentStepIndex > 0 && (
                    <button onClick={prevStep} className="px-3 py-1 text-sm text-dark-text-secondary rounded-md hover:bg-gray-700 mr-2">Précédent</button>
                )}
                {currentStepIndex < tourSteps.length - 1 ? (
                    <button onClick={nextStep} className="px-3 py-1 text-sm bg-brand-lightblue text-white rounded-md hover:bg-brand-blue">Suivant</button>
                ) : (
                    <button onClick={stopTour} className="px-3 py-1 text-sm bg-brand-accent text-dark-bg font-semibold rounded-md hover:opacity-90">Terminer</button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
