# 🚀 Guide de Déploiement Production - CACRS

## 📋 Prérequis

### Comptes et Accès
- ✅ Compte Google Cloud (Projet ID: `9546768441`)
- ✅ Permissions: Editor ou Owner
- ✅ APIs activées:
  - Cloud Run
  - Secret Manager
  - Cloud Build
  - Container Registry
  - Identity Platform

### Outils Requis
```bash
# Google Cloud SDK
gcloud --version

# Node.js & npm
node --version  # v18+
npm --version

# Docker (optionnel pour tests locaux)
docker --version
```

## 🔐 Configuration des Secrets

### 1. Créer les Secrets dans Google Secret Manager

```bash
# Se connecter à GCP
gcloud auth login
gcloud config set project 9546768441

# Créer les secrets pour les services activés
echo -n "VOTRE_CLE_GEMINI" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo -n "VOTRE_CONFIG_FIREBASE" | gcloud secrets create FIREBASE_CONFIG --data-file=-

# Pour les autres services (optionnel)
echo -n "VOTRE_CLE_OPENAI" | gcloud secrets create OPENAI_API_KEY --data-file=-
echo -n "VOTRE_CLE_ANTHROPIC" | gcloud secrets create ANTHROPIC_API_KEY --data-file=-
echo -n "VOTRE_TOKEN_TWITTER" | gcloud secrets create TWITTER_BEARER_TOKEN --data-file=-

# Vérifier les secrets créés
gcloud secrets list
```

### 2. Donner les Permissions

```bash
# Permettre à Cloud Run d'accéder aux secrets
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Répéter pour chaque secret
```

## 🏗️ Déploiement Frontend

### Option 1: Google Cloud Storage + Cloud CDN

```bash
# 1. Build de production
npm run build

# 2. Créer un bucket
gsutil mb -p 9546768441 -c STANDARD -l us-central1 gs://cacrs-frontend

# 3. Configurer pour servir du web
gsutil web set -m index.html -e index.html gs://cacrs-frontend

# 4. Déployer
gsutil -m rsync -r -d dist/ gs://cacrs-frontend/

# 5. Rendre public
gsutil iam ch allUsers:objectViewer gs://cacrs-frontend

# 6. URL d'accès
echo "https://storage.googleapis.com/cacrs-frontend/index.html"
```

### Option 2: Firebase Hosting (Recommandé)

```bash
# 1. Installer Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialiser Firebase
firebase init hosting

# Sélectionner:
# - Projet: cacrs-frontend
# - Directory: dist
# - Single-page app: Yes
# - GitHub actions: No

# 4. Déployer
npm run build
firebase deploy --only hosting

# URL: https://cacrs-frontend.web.app
```

## 🔧 Déploiement Backend (Cloud Run)

### Structure Backend Recommandée

```
backend/
├── Dockerfile
├── package.json
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── admin.ts
│   │   └── services.ts
│   ├── services/
│   │   └── secretManager.ts
│   └── middleware/
│       ├── auth.ts
│       └── rbac.ts
```

### Dockerfile Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]
```

### Déployer sur Cloud Run

```bash
# 1. Build et push de l'image
gcloud builds submit --tag gcr.io/9546768441/cacrs-backend

# 2. Déployer sur Cloud Run
gcloud run deploy cacrs-backend \
  --image gcr.io/9546768441/cacrs-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest,FIREBASE_CONFIG=FIREBASE_CONFIG:latest"

# 3. Récupérer l'URL
gcloud run services describe cacrs-backend --region us-central1 --format 'value(status.url)'
```

## �� CI/CD avec Cloud Build

### cloudbuild.yaml (déjà existant)

Vérifier et adapter le fichier `cloudbuild.yaml`:

```yaml
steps:
  # Build frontend
  - name: 'node:18'
    entrypoint: npm
    args: ['install']
  
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']
  
  # Deploy to Firebase
  - name: 'gcr.io/$PROJECT_ID/firebase'
    args: ['deploy', '--only', 'hosting', '--token', '${_FIREBASE_TOKEN}']

  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/cacrs-backend', './backend']
  
  # Push backend image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/cacrs-backend']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'cacrs-backend'
      - '--image=gcr.io/$PROJECT_ID/cacrs-backend'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'gcr.io/$PROJECT_ID/cacrs-backend'
```

### Déclencher le Build

```bash
# Manuellement
gcloud builds submit --config cloudbuild.yaml

# Ou configurer trigger GitHub
gcloud builds triggers create github \
  --repo-name=run-Veille-investigation \
  --repo-owner=VOTRE_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## 🧪 Tests Pré-Déploiement

```bash
# 1. Tests TypeScript
npm run lint

# 2. Build local
npm run build

# 3. Tests E2E (nécessite serveur local)
npm run dev &
DEV_PID=$!
sleep 5
npm run test
kill $DEV_PID

# 4. Script de test complet
./scripts/run-all-tests.sh
```

## 🔍 Vérifications Post-Déploiement

### 1. Smoke Tests

```bash
# Frontend
curl -I https://cacrs-frontend.web.app

# Backend
curl https://cacrs-backend-XXXXX-uc.a.run.app/health

# Admin endpoint (avec auth)
curl -H "Authorization: Bearer TOKEN" \
  https://cacrs-backend-XXXXX-uc.a.run.app/api/admin/services
```

### 2. Tests Fonctionnels

```bash
# Utiliser Playwright en mode headless contre prod
PLAYWRIGHT_BASE_URL=https://cacrs-frontend.web.app npm run test
```

### 3. Performance

```bash
# Lighthouse
npm run lighthouse

# Ou manuellement
lighthouse https://cacrs-frontend.web.app \
  --output html \
  --output-path ./lighthouse-report.html
```

## 📊 Monitoring

### 1. Cloud Monitoring

```bash
# Créer des dashboards
gcloud monitoring dashboards create --config-from-file=monitoring-dashboard.json
```

### 2. Alertes

```bash
# Alerte si erreur rate > 1%
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="CACRS Error Rate High" \
  --condition-display-name="Error rate > 1%" \
  --condition-threshold-value=0.01 \
  --condition-threshold-duration=60s
```

### 3. Logs

```bash
# Voir les logs Cloud Run
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=cacrs-backend" \
  --limit 50 \
  --format json

# Streamer les logs en temps réel
gcloud logging tail "resource.type=cloud_run_revision"
```

## 🔒 Sécurité

### 1. Activer HTTPS uniquement

```bash
# Cloud Run force HTTPS par défaut
# Vérifier:
gcloud run services describe cacrs-backend --region us-central1 --format='value(status.url)'
# Doit commencer par https://
```

### 2. Configurer CORS

Dans le backend:
```typescript
app.use(cors({
  origin: ['https://cacrs-frontend.web.app', 'https://cacrs-frontend.firebaseapp.com'],
  credentials: true
}));
```

### 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});

app.use('/api/', limiter);
```

## 🔄 Rollback

### Si problème détecté

```bash
# Lister les révisions
gcloud run revisions list --service cacrs-backend --region us-central1

# Rollback vers version précédente
gcloud run services update-traffic cacrs-backend \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

## 📞 Support

En cas de problème:

1. **Logs Cloud Run**: `gcloud logging tail`
2. **Monitoring**: Console GCP > Monitoring
3. **Secrets**: Console GCP > Secret Manager
4. **Support Google Cloud**: https://cloud.google.com/support

## ✅ Checklist de Déploiement

- [ ] Secrets créés dans Secret Manager
- [ ] Permissions configurées
- [ ] Tests passent en local
- [ ] Build réussi
- [ ] Frontend déployé
- [ ] Backend déployé
- [ ] Smoke tests prod passent
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Documentation à jour
- [ ] Équipe informée

## 🎯 URLs de Production

```
Frontend: https://cacrs-frontend.web.app
Backend:  https://cacrs-backend-XXXXX-uc.a.run.app
Admin:    https://cacrs-frontend.web.app/#/admin
Services: https://cacrs-frontend.web.app/#/admin/services
```

---

**Bon déploiement! 🚀**
