import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import Web Vitals for production monitoring
if (import.meta.env.PROD) {
  import('./utils/webVitals').then(({ initWebVitals }) => {
    initWebVitals();
  }).catch(err => {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Web Vitals not available:', err);
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);