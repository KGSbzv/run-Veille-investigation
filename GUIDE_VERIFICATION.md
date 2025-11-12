# GUIDE DE VÉRIFICATION RAPIDE - Projet CACRS

## ✅ Checklist Pré-Déploiement

### 1. Build & Compilation
```bash
cd /Users/robby/Documents/GitHub/run-Veille-investigation

# Vérifier TypeScript
npm run lint
# ✅ Résultat attendu: 0 erreurs

# Build production
npm run build
# ✅ Résultat attendu: Build réussi dans /dist
```

### 2. Configuration Variables d'Environnement

Vérifier `.env.local` existe et contient:
```bash
cat .env.local
```

Minimum requis:
```
VITE_GEMINI_API_KEY=<ta_clé_gemini>
VITE_GOOGLE_CLIENT_ID=<ton_client_id>.apps.googleusercontent.com
```

### 3. Services Installés
```bash
# Vérifier dépendances
npm list web-vitals
npm list @google/genai
npm list react
npm list react-router-dom
```

### 4. Tests Rapides

#### Test de démarrage
```bash
npm run dev
```
- ✅ Ouvrir http://localhost:5173
- ✅ Page de login doit s'afficher
- ✅ Bouton Google Sign-In visible

#### Test Login (avec compte admin)
1. Se connecter avec: nyh770@gmail.com
2. ✅ Redirection vers /dashboard
3. ✅ Sidebar visible avec toutes les sections

#### Test Admin Services
1. Aller dans "Administration"
2. Cliquer sur onglet "Services & IA / Secrets"
3. ✅ Liste de 15 services affichée
4. ✅ Filtres fonctionnent
5. ✅ Toggle enable/disable fonctionne
6. ✅ Champs de configuration éditables

#### Test Chat IA
1. Aller dans "Dossiers"
2. Cliquer sur un dossier
3. Envoyer un message dans le chat
4. ✅ Réponse Gemini reçue

#### Test Recherche Web
1. Aller dans "Veille & Findings"
2. Entrer une requête
3. Cliquer "Rechercher"
4. ✅ Résultats avec sources affichés

---

## 🔍 Vérification des Fichiers Critiques

### Frontend
```bash
# Vérifier présence des nouveaux fichiers
ls -la src/types/services.ts
ls -la src/config/servicesRegistry.ts
ls -la src/services/servicesManager.ts
ls -la src/pages/AdminServicesSettings.tsx

# Vérifier modifications
git status
git diff src/pages/AdminPage.tsx
git diff src/utils/webVitals.ts
```

### Configuration
```bash
# Vérifier fichiers de config
cat vite.config.ts
cat tsconfig.json
cat package.json
```

---

## 🐛 Troubleshooting

### Problème: Build échoue avec erreur terser
```bash
npm install terser --save-dev
npm run build
```

### Problème: Erreurs TypeScript
```bash
npm run lint > errors.log
cat errors.log
```

### Problème: Gemini API ne répond pas
1. Vérifier `.env.local` contient `VITE_GEMINI_API_KEY`
2. Vérifier la clé est valide sur https://aistudio.google.com
3. Vérifier dans DevTools Console pour erreurs API

### Problème: Google Sign-In ne fonctionne pas
1. Vérifier `VITE_GOOGLE_CLIENT_ID` dans `.env.local`
2. Vérifier le script Google Identity Services est chargé:
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```
3. Vérifier dans Console: `typeof google !== 'undefined'`

### Problème: Services page vide
1. Ouvrir DevTools Console
2. Chercher erreurs JavaScript
3. Vérifier lazy loading:
   ```javascript
   const AdminServicesSettings = lazy(() => import('./AdminServicesSettings'));
   ```

---

## 📊 Métriques de Qualité

### Performance
```bash
npm run lighthouse
```
Objectifs:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Bundle Size
```bash
npm run build
du -sh dist/assets/*.js
```
Objectifs:
- Index JS: < 500KB (gzipped < 150KB)
- Vendor JS: < 300KB (gzipped < 100KB)

### Code Quality
```bash
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l
# Nombre total de lignes
```

---

## 🚀 Commandes de Déploiement

### Build pour Production
```bash
# Clean
rm -rf dist

# Build
NODE_ENV=production npm run build

# Vérifier output
ls -lh dist/
```

### Test Build Local
```bash
npm run preview
# Ouvrir http://localhost:4173
```

### Déploiement Cloud Run (à venir)
```bash
# Build image Docker
docker build -t cacrs-frontend .

# Test local
docker run -p 8080:80 cacrs-frontend

# Push vers Artifact Registry (GCP)
# gcloud builds submit --tag gcr.io/PROJECT_ID/cacrs-frontend

# Deploy vers Cloud Run
# gcloud run deploy cacrs-frontend --image gcr.io/PROJECT_ID/cacrs-frontend
```

---

## 📝 Tests Manuels Complets

### Scénario 1: Utilisateur Analyste
1. ✅ Login avec compte non-admin
2. ✅ Accès Dashboard
3. ✅ Créer un nouveau dossier
4. ✅ Upload un fichier dans le dossier
5. ✅ Chatter avec l'IA
6. ✅ Générer un rapport
7. ✅ Créer une watchlist
8. ✅ Effectuer une recherche web
9. ✅ Sauvegarder un finding
10. ❌ Pas d'accès à l'admin

### Scénario 2: Administrateur
1. ✅ Login avec nyh770@gmail.com
2. ✅ Accès Dashboard
3. ✅ Accès page Admin
4. ✅ Voir liste des utilisateurs
5. ✅ Modifier rôle d'un utilisateur
6. ✅ Désactiver/Activer un utilisateur
7. ✅ Accès tab "Services & IA"
8. ✅ Activer/Désactiver un service
9. ✅ Configurer un secret
10. ✅ Tester une connexion API
11. ✅ Modifier config IA (temperature, model)
12. ✅ Utiliser les filtres

---

## 🔐 Sécurité - Checklist

### Frontend
- ✅ Pas de clés API hardcodées dans le code
- ✅ Variables d'env utilisent `VITE_` prefix
- ✅ `.env.local` dans `.gitignore`
- ✅ Routes admin protégées par rôle
- ✅ JWT décodé uniquement pour info (pas de vérif signature côté client)
- ⚠️ TODO: HTTPS enforced en production
- ⚠️ TODO: CSP headers
- ⚠️ TODO: CORS configuré

### Backend (TODO)
- ⚠️ Vérification JWT serveur
- ⚠️ Rate limiting
- ⚠️ Input validation
- ⚠️ SQL injection prevention
- ⚠️ XSS prevention
- ⚠️ CSRF tokens

---

## 📈 Monitoring (TODO Backend)

### Métriques à Surveiller
1. **API Latency**
   - Gemini API: < 3s
   - Search API: < 5s
   - Database queries: < 100ms

2. **Error Rates**
   - API errors: < 1%
   - 500 errors: < 0.1%
   - Auth failures: < 5%

3. **Utilisation**
   - Services IA actifs
   - Tokens consommés / jour
   - Utilisateurs actifs
   - Requêtes / minute

4. **Coûts**
   - Gemini API: $ / 1M tokens
   - Cloud Run: $ / 1M requêtes
   - Cloud Storage: $ / GB
   - Total mensuel

---

## 🎯 Prêt pour Production?

### Checklist Frontend ✅
- [x] TypeScript 0 erreurs
- [x] Build production réussit
- [x] Routes toutes testées
- [x] Auth Google fonctionne
- [x] Module Services implémenté
- [x] Interface responsive
- [x] Erreurs gérées gracefully
- [x] Loading states partout

### Checklist Backend ⚠️
- [ ] API REST implémentée
- [ ] Base de données PostgreSQL
- [ ] Google Secret Manager intégré
- [ ] Vérification JWT serveur
- [ ] RBAC backend
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Logs structurés

### Checklist Infra ⚠️
- [ ] Cloud Run configuré
- [ ] Secrets dans Secret Manager
- [ ] Cloud SQL provisionné
- [ ] Backup automatique
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] CI/CD pipeline
- [ ] DNS configuré

---

## 📞 Support

### Logs
```bash
# Frontend (DevTools Console)
# Ouvrir DevTools > Console

# Backend (à venir)
# gcloud logging read "resource.type=cloud_run_revision"
```

### Debug Mode
```bash
# Mode développement avec console visible
VITE_DEBUG=true npm run dev
```

---

**Dernière mise à jour**: 12 Novembre 2025
**Status**: Frontend Production-Ready ✅ | Backend TODO ⚠️
