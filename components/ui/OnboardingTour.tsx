import React, { useEffect, useState, useRef } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';

const OnboardingTour: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    nextStep,
    previousStep,
    skipTour,
  } = useOnboarding();

  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [spotlightPosition, setSpotlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(currentStep.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const padding = currentStep.spotlightPadding || 8;

      setSpotlightPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      if (!tooltipRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const placement = currentStep.placement || 'bottom';
      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 16;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - 16;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + 16;
          break;
      }

      left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));

      setTooltipPosition({ top, left });

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep]);

  if (!isActive || !currentStep) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" onClick={skipTour} />

      {/* Spotlight */}
      <div
        className="fixed z-[9999] pointer-events-none transition-all duration-300 rounded-lg"
        style={{
          top: `${spotlightPosition.top}px`,
          left: `${spotlightPosition.left}px`,
          width: `${spotlightPosition.width}px`,
          height: `${spotlightPosition.height}px`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] bg-white rounded-lg shadow-2xl p-6 max-w-md"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
            <span className="text-sm text-gray-500">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <p className="text-sm text-gray-600">{currentStep.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={skipTour}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Passer
          </button>
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={previousStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Précédent
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {currentStepIndex === totalSteps - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
