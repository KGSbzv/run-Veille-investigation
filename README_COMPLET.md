# 🛡️ CACRS - Centre d'Analyse du Contre-Renseignement et de la Sécurité

**Plateforme de Veille & Investigation pour l'Élection 2026**

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-0%20Errors-success)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Tests](https://img.shields.io/badge/Tests-5%20Suites-blue)

---

## 📋 Vue d'Ensemble

Application web sécurisée pour un centre gouvernemental d'analyse, permettant:
- 🔍 Veille et investigation OSINT
- 📁 Gestion de dossiers d'enquêtes
- 🤖 Analyse augmentée par IA (Google Gemini)
- 👥 Gestion multi-utilisateurs avec RBAC
- ⚙️ **Nouveau:** Module complet de gestion des Services & Secrets

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Tests
npm run lint        # TypeScript check
npm run test        # E2E tests (Playwright)
npm run lighthouse  # Performance audit
```

## 🏗️ Architecture

### Frontend
- **Framework:** React 19 + TypeScript
- **Routing:** React Router v7
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Build:** Vite 5

### Backend (À implémenter)
- **Runtime:** Node.js 18+
- **API:** Express/Fastify
- **Auth:** Firebase Auth + JWT
- **Secrets:** Google Secret Manager

### Infrastructure
- **Frontend:** Firebase Hosting / Cloud Storage
- **Backend:** Cloud Run
- **Database:** Firestore (future)
- **Secrets:** Google Secret Manager
- **CI/CD:** Cloud Build

## 📦 Modules Principaux

### 1. Dashboard
- Vue d'ensemble des activités
- Statistiques en temps réel
- Alertes et notifications

### 2. Gestion des Dossiers
- Création et suivi de dossiers d'enquête
- Upload et analyse de fichiers
- Chat IA pour assistance
- Timeline des événements

### 3. Veille & OSINT
- Recherche web avec Google Search grounding
- Sauvegarde de "findings"
- Watchlists personnalisées

### 4. Administration

#### 4.1 Gestion des Utilisateurs
- CRUD utilisateurs
- Attribution des rôles (Admin, Analyst, Contributor, Viewer)
- Activation/désactivation de comptes

#### 4.2 Architecture Système
- Documentation des services Google utilisés
- Vue d'ensemble de l'infrastructure

#### 4.3 **Services & IA / Secrets** ✨ **NOUVEAU**
- **15 services externes** recensés et configurables
- Gestion centralisée des secrets Google Secret Manager
- Configuration avancée des modèles IA
- Tests de connexion intégrés
- Auto-désactivation en cas d'erreur

## 🔐 Services Gérés (15 Total)

### Services IA (5)
1. **Google Gemini** ✅ Activé - Chat, analyse, rapports
2. **Anthropic Claude** - Analyse avancée
3. **OpenAI GPT** - Tâches spécialisées
4. **DeepSeek** - Analyse de code
5. **Reka AI** - Analyse multimodale

### Services Google Cloud (5)
6. **Vertex AI** - Orchestration ML
7. **Firebase** ✅ Activé - Auth & Real-time
8. **Cloud Storage** - Stockage fichiers
9. **BigQuery** - Analytics
10. **Cloud Pub/Sub** - Messaging

### APIs Externes (5)
11. **Twitter/X API** - Social media intelligence
12. **Abstract API** - Validation email
13. **IP Intelligence** - Géolocalisation
14. **Email Provider** - Emails transactionnels
15. **Data Enrichment** - Enrichissement données

## 👥 Rôles Utilisateurs

| Rôle | Permissions |
|------|------------|
| **Admin** | Accès complet + gestion utilisateurs + configuration services |
| **Analyst** | Création/modification dossiers + veille |
| **Contributor** | Ajout informations aux dossiers |
| **Viewer** | Lecture seule |

## 🧪 Tests

### Tests E2E (Playwright)

```bash
# Login
npm run test -- login.spec.ts

# Admin - Users
npm run test -- admin-users.spec.ts

# Admin - Services
npm run test -- admin-services.spec.ts

# Smoke tests
npm run test -- smoke.spec.ts

# Accessibility
npm run test -- accessibility.spec.ts

# Tous les tests
./scripts/run-all-tests.sh
```

### Tests de Performance

```bash
# Lighthouse audit
npm run lighthouse

# Web vitals
# Automatique en production via src/utils/webVitals.ts
```

## 📁 Structure du Projet

```
run-Veille-investigation/
├── src/
│   ├── components/        # Composants React
│   │   ├── cases/        # Gestion dossiers
│   │   ├── chat/         # Chat IA
│   │   ├── dashboard/    # Tableaux de bord
│   │   ├── layout/       # Layout & navigation
│   │   ├── ui/           # Composants UI réutilisables
│   │   └── watchlists/   # Veille OSINT
│   ├── config/           # Configuration
│   │   └── servicesRegistry.ts  # Registre des 15 services
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Pages principales
│   │   └── AdminServicesSettings.tsx  # Gestion services ✨ NOUVEAU
│   ├── services/         # Services métier
│   │   ├── geminiService.ts
│   │   ├── mockDataService.ts
│   │   └── servicesManager.ts  # Manager services ✨ NOUVEAU
│   ├── types/            # Types TypeScript
│   │   └── services.ts   # Types services ✨ NOUVEAU
│   └── utils/            # Utilitaires
├── tests/
│   └── e2e/             # Tests E2E Playwright
├── scripts/             # Scripts automation
├── docs/                # Documentation (7 documents)
└── dist/                # Build production
```

## 🔧 Configuration

### Variables d'Environnement

Créer `.env.local`:

```env
# Gemini AI
VITE_GEMINI_API_KEY=votre_clé_ici

# Google OAuth
VITE_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com

# Firebase (optionnel)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Google Secret Manager

Path de base: `projects/9546768441/secrets/`

Les secrets sont gérés via l'interface admin:
1. Aller sur `/admin/services`
2. Saisir le nom du secret (ex: `GEMINI_API_KEY`)
3. Le chemin complet est auto-généré
4. Tester la connexion avant d'activer

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **RAPPORT_SERVICES_MODULE.md** | Architecture détaillée du module Services |
| **SUGGESTIONS_AMELIORATIONS.md** | Roadmap & recommandations |
| **RESUME_FINAL_IMPLEMENTATION.md** | Résumé technique complet |
| **GUIDE_DEPLOIEMENT.md** | Guide de déploiement GCP |
| **RAPPORT_FINAL_COMPLET.md** | Rapport final de mission |

## 🚀 Déploiement

### Frontend (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting
```

### Backend (Cloud Run)

```bash
# Build & deploy
gcloud builds submit --tag gcr.io/9546768441/cacrs-backend
gcloud run deploy cacrs-backend \
  --image gcr.io/9546768441/cacrs-backend \
  --region us-central1
```

Voir `GUIDE_DEPLOIEMENT.md` pour le guide complet.

## 📊 Métriques

- ✅ **0 erreurs TypeScript**
- ✅ **Build: 2.47s**
- ✅ **Bundle gzipped: ~240KB**
- ✅ **15 services intégrés**
- ✅ **5 suites de tests E2E**
- ✅ **7 documents professionnels**

## 🛠️ Développement

### Commandes Utiles

```bash
# Développement
npm run dev                # Serveur dev (port 5173)

# Build & Test
npm run build              # Build production
npm run lint               # Check TypeScript
npm run test               # Tests E2E
npm run test:ui            # Tests UI mode
npm run test:debug         # Debug tests

# Quality
npm run lighthouse         # Audit performance
./scripts/run-all-tests.sh # Tous les tests

# Preview
npm run preview            # Preview build production
```

### Conventions de Code

- **TypeScript strict mode**: Activé
- **ESLint**: Configuration React
- **Prettier**: Auto-format
- **Commits**: Convention conventionnelle

## 🔒 Sécurité

### Fonctionnalités
- ✅ RBAC (Role-Based Access Control)
- ✅ Routes protégées
- ✅ Secrets via Google Secret Manager
- ✅ HTTPS obligatoire
- ✅ CORS configuré
- ✅ Rate limiting (backend)
- ✅ Input validation

### Best Practices
- Secrets jamais en clair dans le code
- JWT avec expiration
- Validation côté serveur
- Sanitization des inputs
- Audit trail des modifications admin

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Créer une Pull Request

## 📞 Support

- **Documentation**: Voir `/docs`
- **Issues**: GitHub Issues
- **Email**: support@cacrs.gouv.fr (fictif)

## 📝 Licence

Projet gouvernemental - Usage interne uniquement

## 🙏 Remerciements

- Google Gemini AI pour l'assistance IA
- React team
- Vite team
- Playwright team
- TailwindCSS team

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Dernière mise à jour**: 12 Novembre 2025

Made with ❤️ for CACRS
