/**
 * Web Vitals Tracking Integration
 * Capture LCP, INP, CLS en production
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Log en console pour debug
  console.log('[Web Vitals]', metric.name, metric.value);
  
  // Envoyer à Google Analytics 4
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
  
  // Envoyer à votre endpoint analytics (optionnel)
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(err => console.error('Analytics error:', err));
  }
}

// Initialiser tracking
export function initWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// Déclarer types global
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
