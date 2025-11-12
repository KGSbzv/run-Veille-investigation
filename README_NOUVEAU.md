# 🛡️ CACRS - Centre d'Analyse du Contre-Renseignement et de la Sécurité

**Plateforme de Veille & d'Investigation pour l'Élection 2026**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://github.com)

---

## 📋 Table des Matières

- [Vue d'Ensemble](#vue-densemble)
- [Nouveautés](#-nouveautés-importantes)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Services & Secrets](#-services--secrets)
- [Déploiement](#-déploiement)
- [Tests](#-tests)
- [Documentation](#-documentation)
- [Contribution](#-contribution)

---

## Vue d'Ensemble

CACRS est une plateforme web moderne et sécurisée conçue pour assister les analystes du contre-renseignement dans leurs enquêtes liées à l'élection 2026. Elle combine :

- 🤖 **Intelligence Artificielle** (Google Gemini) pour l'analyse et la génération de rapports
- 🔍 **Recherche Web Avancée** avec sources citées
- 📁 **Gestion de Dossiers** d'enquête avec timeline
- 👥 **Gestion d'Utilisateurs** avec rôles et permissions (RBAC)
- ⚙️ **Gestion Centralisée des Services** externes et secrets (Google Secret Manager)
- 🔐 **Authentification Google OAuth** sécurisée
- 📊 **Tableau de Bord** avec métriques et alertes

---

## ⭐ Nouveautés Importantes

### Module Services & Secrets (Nouveau! 🎉)

L'application dispose maintenant d'un **module complet de gestion des services externes et secrets** :

- **15 services pré-configurés** (Gemini, OpenAI, Anthropic, DeepSeek, Reka, Firebase, Twitter, etc.)
- **Interface d'administration intuitive** pour configurer et tester chaque service
- **Intégration Google Secret Manager** (chemin automatique: `projects/9546768441/secrets/`)
- **Test de connectivité** en un clic pour chaque service
- **Auto-désactivation** en cas d'erreur critique
- **Configuration IA avancée** (model, temperature, tokens, etc.)

**Accès**: Menu Admin > Onglet "Services & IA / Secrets"

---

## 🚀 Fonctionnalités

### Pour les Analystes

- ✅ **Dossiers d'Enquête**
  - Création et gestion de dossiers
  - Catégorisation (Désinformation, Cybersécurité, Finance)
  - Tags personnalisés
  - Statuts (Ouvert, En cours, Fermé)

- ✅ **Chat IA avec Gemini**
  - Conversation contextuelle par dossier
  - Analyse de documents et images
  - Génération de rapports automatiques
  - Sources citées

- ✅ **Veille & Recherche Web**
  - Recherche web avec Google Search grounding
  - Sauvegarde des findings pertinents
  - Création de watchlists automatiques
  - Sources web citées

- ✅ **Gestion de Fichiers**
  - Upload de documents (PDF, DOCX, images)
  - Analyse automatique par IA
  - Timeline des événements

### Pour les Administrateurs

- ✅ **Gestion des Utilisateurs**
  - Liste complète des utilisateurs
  - Modification des rôles (Admin, Analyst, Contributor, Viewer)
  - Activation/Désactivation des comptes
  - Filtres et recherche

- ✅ **Gestion des Services & Secrets** ⭐ NOUVEAU
  - Configuration centralisée de 15 services externes
  - Test de connectivité API
  - Gestion des secrets Google Secret Manager
  - Configuration avancée des modèles IA
  - Monitoring du statut des services

- ✅ **Architecture Système**
  - Vue d'ensemble des services Google Cloud
  - Documentation technique

---

## 🏗️ Architecture

### Frontend
```
React 19.2 + TypeScript 5.2
├── Vite 5.3 (Build tool)
├── React Router 7.9 (Navigation)
├── Tailwind CSS 3.4 (Styling)
├── Recharts 2.12 (Charts)
└── Google Generative AI SDK
```

### Services Externes Supportés (15)

#### IA/LLM (6)
1. **Gemini** - Google Generative AI ✅ Actif
2. **Anthropic** - Claude
3. **OpenAI** - GPT
4. **DeepSeek** - DeepSeek Chat
5. **Reka** - Reka AI
6. **Vertex AI** - ML Platform

#### Google Cloud (4)
7. **Firebase** - Auth & Database ✅ Actif
8. **Cloud Storage** - File storage
9. **BigQuery** - Analytics
10. **Cloud Pub/Sub** - Messaging

#### Services Externes (5)
11. **Twitter/X** - Social media intel
12. **Abstract API** - Email validation
13. **IP Intelligence** - Geolocation
14. **Email Provider** - Transactional emails
15. **Data Enrichment** - Person/company data

### Backend (à implémenter)
- API REST/GraphQL
- PostgreSQL + pgvector (RAG)
- Google Secret Manager
- Cloud Run

---

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm 9+
- Compte Google Cloud Platform
- Clés API (Gemini, Google OAuth)

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/votre-org/cacrs.git
cd cacrs

# 2. Installer les dépendances
npm install

# 3. Copier la configuration
cp .env.example .env.local

# 4. Éditer .env.local avec vos clés
nano .env.local

# 5. Lancer le serveur de développement
npm run dev

# 6. Ouvrir http://localhost:5173
```

---

## ⚙️ Configuration

### Variables d'Environnement (.env.local)

#### Obligatoires

```bash
# Gemini AI (Service Principal)
VITE_GEMINI_API_KEY=votre_clé_gemini_ici

# Google OAuth (Authentification)
VITE_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
```

**Comment obtenir les clés** :

1. **Gemini API** : https://aistudio.google.com/app/apikey
2. **Google OAuth** : https://console.cloud.google.com/apis/credentials

#### Optionnelles (autres services)

Voir `.env.example` pour la liste complète des 15 services configurables via l'interface admin.

---

## 🎯 Utilisation

### Démarrage Rapide

```bash
# Développement
npm run dev              # Serveur de dev sur http://localhost:5173

# Build
npm run build            # Build production dans /dist

# Preview
npm run preview          # Prévisualiser le build

# Vérification
npm run lint             # Check TypeScript errors
```

### Scripts Utiles

```bash
# Tests
npm run test             # Tests E2E Playwright
npm run test:headed      # Tests avec UI
npm run test:debug       # Mode debug

# Qualité
npm run lighthouse       # Audit performance
./scripts/verify-project.sh  # Vérification complète du projet
```

### Connexion

1. Ouvrir http://localhost:5173
2. Cliquer sur "Sign in with Google"
3. Se connecter avec un compte Google

**Compte Admin par défaut** : `nyh770@gmail.com`

### Navigation

- **Dashboard** : Vue d'ensemble, statistiques, alertes
- **Dossiers** : Gestion des enquêtes
- **Veille & Findings** : Recherche web et sauvegarde
- **Administration** : (Admin uniquement)
  - Gestion Utilisateurs
  - **Services & IA / Secrets** ⭐
  - Architecture Système

---

## 🔐 Services & Secrets

### Accès à l'Interface

1. Se connecter en tant qu'admin
2. Menu **Administration**
3. Onglet **Services & IA / Secrets**

### Configuration d'un Service

1. **Activer le service** : Toggle ON
2. **Configurer le secret** :
   - Saisir uniquement le nom : `GEMINI_API_KEY`
   - Le système ajoute automatiquement : `projects/9546768441/secrets/`
3. **Configurer les paramètres** (si service IA) :
   - Model
   - Temperature (0-2)
   - Max Output Tokens
   - Top P
4. **Tester** : Cliquer sur "Tester la connexion"
5. Vérifier le statut : 🟢 OK / 🔴 Erreur / ⚪ Désactivé

### Filtres Disponibles

- **Tous** : Afficher les 15 services
- **Activés** : Services en cours d'utilisation
- **Services IA** : Uniquement les LLMs

### Statuts

| Badge | Signification |
|-------|---------------|
| 🟢 OK | Service opérationnel |
| 🔴 Erreur | Problème détecté |
| 🟡 Non testé | Jamais vérifié |
| ⚪ Désactivé | Service éteint |

---

## 🚀 Déploiement

### Build Production

```bash
# Clean
rm -rf dist

# Build
NODE_ENV=production npm run build

# Vérifier
ls -lh dist/
```

### Déploiement Cloud Run (GCP)

```bash
# 1. Build Docker image
docker build -t cacrs-frontend .

# 2. Tag pour GCP
docker tag cacrs-frontend gcr.io/PROJECT_ID/cacrs-frontend

# 3. Push vers Container Registry
docker push gcr.io/PROJECT_ID/cacrs-frontend

# 4. Deploy sur Cloud Run
gcloud run deploy cacrs-frontend \
  --image gcr.io/PROJECT_ID/cacrs-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Configuration Secrets (Production)

```bash
# Créer les secrets dans Secret Manager
echo -n "votre_clé_gemini" | gcloud secrets create GEMINI_API_KEY --data-file=-

# Donner accès à Cloud Run
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🧪 Tests

### Tests E2E (Playwright)

```bash
# Tous les tests
npm run test

# Mode UI
npm run test:ui

# Mode headed (voir le navigateur)
npm run test:headed

# Mode debug
npm run test:debug

# Rapport
npm run test:report
```

### Tests de Performance (Lighthouse)

```bash
npm run lighthouse
```

Objectifs :
- Performance : >90
- Accessibility : >95
- Best Practices : >90
- SEO : >90

### Vérification Complète

```bash
./scripts/verify-project.sh
```

Ce script vérifie :
- ✅ Dépendances
- ✅ Fichiers du projet
- ✅ Configuration
- ✅ TypeScript
- ✅ Build
- ✅ Sécurité
- ✅ Documentation

---

## 📚 Documentation

### Documents Disponibles

| Document | Description |
|----------|-------------|
| `README.md` | Ce fichier |
| `AUDIT_COMPLET_2025.md` | Audit technique détaillé |
| `RAPPORT_FINAL_IMPLEMENTATION.md` | Rapport d'implémentation |
| `GUIDE_VERIFICATION.md` | Guide de vérification |
| `SUGGESTIONS_AMELIORATION.md` | 32 suggestions d'amélioration |
| `README_DEPLOYMENT.md` | Guide de déploiement |
| `README_TESTS.md` | Guide des tests |

### Structure du Projet

```
cacrs/
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # UI primitives (Icons, Spinner...)
│   │   ├── layout/       # Layout (Sidebar, Layout)
│   │   ├── cases/        # Composants dossiers
│   │   ├── chat/         # Chat IA
│   │   └── ...
│   ├── pages/            # Pages principales
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── AdminServicesSettings.tsx  ⭐ NOUVEAU
│   ├── services/         # Services métier
│   │   ├── geminiService.ts
│   │   ├── mockDataService.ts
│   │   └── servicesManager.ts  ⭐ NOUVEAU
│   ├── config/           # Configuration
│   │   └── servicesRegistry.ts  ⭐ NOUVEAU (15 services)
│   ├── types/            # Types TypeScript
│   │   ├── types.ts
│   │   └── services.ts  ⭐ NOUVEAU
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilitaires
│   ├── App.tsx           # App principale
│   └── index.tsx         # Entry point
├── public/               # Assets statiques
├── tests/                # Tests E2E
├── scripts/              # Scripts utilitaires
├── dist/                 # Build production
└── docs/                 # Documentation
```

---

## 👥 Contribution

### Workflow Git

```bash
# 1. Créer une branche
git checkout -b feature/nom-feature

# 2. Faire vos modifications

# 3. Vérifier
npm run lint
npm run build
npm run test

# 4. Commit
git add .
git commit -m "feat: description de la feature"

# 5. Push
git push origin feature/nom-feature

# 6. Créer une Pull Request
```

### Standards de Code

- ✅ TypeScript strict mode
- ✅ Pas de `console.log` en production
- ✅ Pas de `any` types
- ✅ Noms explicites pour variables/fonctions
- ✅ Commentaires pour logique complexe uniquement
- ✅ Tests pour nouvelles fonctionnalités

---

## 🔧 Troubleshooting

### Problème : Build échoue

```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build
```

### Problème : Gemini API ne répond pas

1. Vérifier `.env.local` contient `VITE_GEMINI_API_KEY`
2. Vérifier la clé sur https://aistudio.google.com
3. Vérifier quota API non dépassé

### Problème : Google Sign-In ne fonctionne pas

1. Vérifier `VITE_GOOGLE_CLIENT_ID` dans `.env.local`
2. Vérifier authorized redirect URIs dans Google Cloud Console
3. Tester sur `http://localhost:5173` (pas HTTPS en dev)

### Problème : TypeScript errors

```bash
npm run lint > errors.log
cat errors.log
```

---

## 📊 Statistiques

- **Lignes de code** : ~10,000
- **Composants React** : 19
- **Pages** : 7
- **Services supportés** : 15
- **Tests E2E** : À implémenter
- **Coverage** : À mesurer

---

## 🎯 Roadmap

### Phase 1 : ✅ Complété
- [x] Interface frontend complète
- [x] Authentification Google OAuth
- [x] Chat IA avec Gemini
- [x] Gestion dossiers
- [x] Recherche web + findings
- [x] Module Services & Secrets

### Phase 2 : ⚠️ En cours
- [ ] Backend API REST
- [ ] Base de données PostgreSQL
- [ ] Google Secret Manager SDK
- [ ] Tests E2E complets

### Phase 3 : ⏳ À venir
- [ ] WebSocket temps réel
- [ ] Service Worker / PWA
- [ ] Analytics avancés
- [ ] Mobile app (React Native)

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 📞 Support

- **Documentation** : Voir `/docs`
- **Issues** : GitHub Issues
- **Email** : support@cacrs.example.com

---

## 🙏 Remerciements

- **Google Gemini** pour l'IA
- **React Team** pour le framework
- **Tailwind CSS** pour le styling
- **Vite** pour le build tool
- **Google Cloud Platform** pour l'infrastructure

---

**Version** : 1.0.0  
**Dernière mise à jour** : 12 Novembre 2025  
**Status** : Frontend Production-Ready ✅ | Backend TODO ⚠️

---

Made with ❤️ for secure investigations
