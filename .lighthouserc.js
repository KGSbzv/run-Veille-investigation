/**
 * Configuration Lighthouse CI
 * Tests de performance automatisés sur toutes les pages principales
 */

module.exports = {
  ci: {
    collect: {
      // URLs à tester
      url: [
        'https://cacrs-frontend-e3cni43iqq-ew.a.run.app/',
        'https://cacrs-frontend-e3cni43iqq-ew.a.run.app/login',
        'https://cacrs-frontend-e3cni43iqq-ew.a.run.app/dashboard',
        'https://cacrs-frontend-e3cni43iqq-ew.a.run.app/cases',
        'https://cacrs-frontend-e3cni43iqq-ew.a.run.app/admin',
      ],
      numberOfRuns: 3, // Moyenne sur 3 runs
      settings: {
        preset: 'desktop',
        // Simulation throttling léger
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Désactiver les extensions
        disableStorageReset: false,
        // Timeout augmenté pour apps complexes
        maxWaitForLoad: 60000,
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance (critiques pour UX)
        'categories:performance': ['error', { minScore: 0.85 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // LCP critique
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],   // CLS critique
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        
        // Accessibilité (WCAG 2.1 AA)
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'color-contrast': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        'aria-roles': ['error', { minScore: 1 }],
        'aria-valid-attr': ['error', { minScore: 1 }],
        
        // Best Practices
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'uses-https': ['error', { minScore: 1 }],
        'no-vulnerable-libraries': ['warn', { minScore: 1 }],
        
        // SEO
        'categories:seo': ['warn', { minScore: 0.85 }],
        'meta-description': ['warn', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        
        // Optimisations ressources
        'unused-javascript': ['warn', { maxNumericValue: 200000 }], // 200KB max
        'uses-optimized-images': ['warn', { minScore: 0.9 }],
        'modern-image-formats': ['warn', { minScore: 0.8 }],
        'offscreen-images': ['warn', { minScore: 0.9 }],
        'uses-text-compression': ['error', { minScore: 1 }],
        'uses-responsive-images': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
