# 🧪 GUIDE DES TESTS - CACRS

## Exécution Rapide

```bash
# Tous les tests
npm test

# Tests + rapport HTML
npm run test:report

# Audit Lighthouse
npm run lighthouse

# Audit complet
npm run audit:full
```

## Documentation Complète

- **TESTS_IMPLEMENTES.md** - Résumé complet des tests installés
- **GUIDE_MONITORING.md** - Configuration monitoring production
- **PLAN_TESTS_PROFESSIONNEL.md** - Plan de tests détaillé

## Tests Disponibles

✅ 30+ tests E2E (Playwright)
✅ Tests accessibilité WCAG 2.1 AA
✅ Visual regression
✅ Lighthouse performance
✅ Web Vitals monitoring

## Fichiers Créés

- `playwright.config.ts`
- `tests/e2e/app.spec.ts`
- `tests/accessibility/a11y.spec.ts`
- `.lighthouserc.js`
- `scripts/lighthouse-audit.sh`

