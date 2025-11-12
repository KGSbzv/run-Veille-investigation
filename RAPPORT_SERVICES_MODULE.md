# Module Services & Secrets - Documentation

## Vue d'Ensemble

Module complet de gestion des services externes et secrets pour le projet CACRS.

## Architecture

```
src/
├── types/
│   └── services.ts          # Types & Interfaces
├── config/
│   └── servicesRegistry.ts  # Registre 15 services
├── services/
│   └── servicesManager.ts   # Logique métier
└── pages/
    └── AdminServicesSettings.tsx  # Interface admin
```

## Services (15 Total)

### Services IA (5)
- Google Gemini
- Anthropic Claude
- OpenAI GPT
- DeepSeek
- Reka AI

### Services Google Cloud (5)
- Vertex AI
- Firebase
- Cloud Storage
- BigQuery
- Cloud Pub/Sub

### APIs Externes (5)
- Twitter/X API
- Abstract API
- IP Intelligence
- Email Provider
- Data Enrichment

## Fonctionnalités

- ✅ Toggle Activé/Désactivé
- ✅ Gestion secrets (`projects/9546768441/secrets/{NAME}`)
- ✅ Configuration IA (model, temperature, tokens)
- ✅ Tests de connexion
- ✅ Auto-désactivation si erreur
- ✅ Badges de statut
- ✅ Route protégée (Admin uniquement)

## Utilisation

1. Accéder à `/admin/services`
2. Configurer les secrets
3. Tester la connexion
4. Activer le service

## Secret Manager

Path de base: `projects/9546768441/secrets/`

L'admin saisit uniquement le suffixe (ex: `GEMINI_API_KEY`).
Le système génère automatiquement le chemin complet.
