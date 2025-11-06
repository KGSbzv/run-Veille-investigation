# 🚀 GUIDE DE CONFIGURATION POST-DÉPLOIEMENT

L'application CACRS est maintenant **déployée sur Cloud Run** ! 🎉

**URL Production:** https://cacrs-frontend-e3cni43iqq-ew.a.run.app

---

## ⚠️ CONFIGURATION REQUISE

L'application nécessite 2 clés API pour fonctionner complètement :

### 1. 🤖 Clé API Gemini

**Obtenir la clé:**
1. Aller sur https://aistudio.google.com/app/apikey
2. Créer une nouvelle clé API
3. Copier la clé

**Configurer:**

**Option A: Développement local**
```bash
cd /Users/robby/Documents/GitHub/run-Veille-investigation
cp .env.example .env.local
# Éditer .env.local et ajouter:
VITE_GEMINI_API_KEY=votre_cle_gemini
```

**Option B: Production (Secret Manager)**
```bash
# Créer le secret
echo "votre_cle_gemini" | gcloud secrets create cacrs-gemini-key --data-file=-

# Mettre à jour cloudbuild.yaml (déjà prêt)
# Redeployer
gcloud builds submit --config=cloudbuild.yaml .
```

---

### 2. 🔐 OAuth Google Client ID

**Obtenir le Client ID:**
1. Aller sur https://console.cloud.google.com/apis/credentials?project=snarecore-cacrs
2. Cliquer "Create Credentials" → "OAuth 2.0 Client ID"
3. Type: "Web application"
4. Authorized JavaScript origins:
   - `http://localhost:5173` (dev)
   - `https://cacrs-frontend-e3cni43iqq-ew.a.run.app` (prod)
5. Authorized redirect URIs:
   - `http://localhost:5173` (dev)
   - `https://cacrs-frontend-e3cni43iqq-ew.a.run.app` (prod)
6. Créer et copier le Client ID

**Configurer:**

**Option A: Développement local**
```bash
# Éditer .env.local
VITE_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
```

**Option B: Production (Secret Manager)**
```bash
# Créer le secret
echo "votre_client_id" | gcloud secrets create cacrs-google-client --data-file=-

# Mettre à jour cloudbuild.yaml pour ajouter:
# - '--set-secrets=VITE_GOOGLE_CLIENT_ID=cacrs-google-client:latest'

# Redeployer
gcloud builds submit --config=cloudbuild.yaml .
```

---

## 🏃 DÉVELOPPEMENT LOCAL

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env.local avec vos clés
cp .env.example .env.local
# Éditer .env.local avec vos clés

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir http://localhost:5173
```

---

## 🔨 BUILD & DÉPLOIEMENT

### Build Local
```bash
npm run build
npm run preview  # Tester le build localement
```

### Déploiement Cloud Run
```bash
# Déploiement complet (build + deploy)
gcloud builds submit --config=cloudbuild.yaml .

# Vérifier le déploiement
gcloud run services describe cacrs-frontend --region=europe-west1
```

---

## 🧪 TESTER L'APPLICATION

### 1. Authentification (avec OAuth Google configuré)
- Aller sur https://cacrs-frontend-e3cni43iqq-ew.a.run.app
- Cliquer sur "Se connecter avec Google"
- S'authentifier

### 2. Accès Admin
- Se connecter avec l'email: `nyh770@gmail.com`
- Aller sur `/admin`
- Vérifier que la page Admin s'affiche

### 3. Accès Utilisateur Normal
- Se connecter avec un autre email
- Essayer d'accéder `/admin` → devrait rediriger vers `/dashboard`

### 4. Fonctionnalités
- **Dashboard:** Voir les statistiques
- **Dossiers d'enquête:** Créer, lister, consulter
- **Upload fichiers:** Tester l'upload et l'analyse IA
- **Chat d'enquête:** Tester les questions/réponses avec Gemini
- **Veille & Findings:** Tester la recherche web

---

## 📊 MONITORING

### Voir les logs
```bash
# Logs en temps réel
gcloud run services logs read cacrs-frontend --region=europe-west1 --tail

# Logs dans la console
# https://console.cloud.google.com/run/detail/europe-west1/cacrs-frontend/logs?project=snarecore-cacrs
```

### Métriques
```bash
# https://console.cloud.google.com/run/detail/europe-west1/cacrs-frontend/metrics?project=snarecore-cacrs
```

---

## 🐛 DÉPANNAGE

### Problème: OAuth Google ne fonctionne pas
**Solution:**
1. Vérifier que VITE_GOOGLE_CLIENT_ID est configuré
2. Vérifier les Authorized origins dans Google Console
3. Vérifier les logs du navigateur (F12)

### Problème: Gemini API ne répond pas
**Solution:**
1. Vérifier que VITE_GEMINI_API_KEY est configuré
2. Vérifier les quotas API: https://aistudio.google.com/app/apikey
3. Vérifier les logs Cloud Run

### Problème: Build échoue
**Solution:**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Problème: Le déploiement échoue
**Solution:**
1. Vérifier les logs: https://console.cloud.google.com/cloud-build/builds?project=snarecore-cacrs
2. Vérifier que les APIs sont activées:
   - Cloud Build API
   - Cloud Run API
   - Container Registry API

---

## 📝 COMMANDES UTILES

```bash
# Redéployer
gcloud builds submit --config=cloudbuild.yaml .

# Mettre à jour une variable d'environnement
gcloud run services update cacrs-frontend --region=europe-west1 \
  --set-env-vars=NOUVELLE_VAR=valeur

# Rollback vers une version précédente
gcloud run services update-traffic cacrs-frontend --region=europe-west1 \
  --to-revisions=cacrs-frontend-00001-xxx=100

# Voir toutes les révisions
gcloud run revisions list --service=cacrs-frontend --region=europe-west1

# Supprimer le service
gcloud run services delete cacrs-frontend --region=europe-west1
```

---

## 📚 DOCUMENTATION

### Rapports Générés
- `RAPPORT_AUDIT_COMPLET.md` - Audit initial de l'application
- `RAPPORT_CORRECTIONS_DEPLOIEMENT.md` - Toutes les corrections effectuées

### Structure du Projet
```
run-Veille-investigation/
├── src/                    # Code source React
│   ├── components/        # Composants React
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services (Gemini, Mock Data)
│   ├── hooks/            # React Hooks
│   └── firebase/         # Config Firebase (vide pour l'instant)
├── dist/                  # Build de production
├── Dockerfile            # Image Docker
├── nginx.conf            # Configuration Nginx
├── cloudbuild.yaml       # Pipeline Cloud Build
├── .env.example          # Template variables d'environnement
└── .env.local           # Variables locales (git ignored)
```

---

## 🎯 PROCHAINES ÉTAPES

### Immédiat
1. ✅ ~~Déployer l'application~~ → **FAIT**
2. ⏳ Configurer VITE_GEMINI_API_KEY
3. ⏳ Configurer VITE_GOOGLE_CLIENT_ID
4. ⏳ Tester toutes les fonctionnalités

### Court Terme
1. Ajouter le logo CACRS
2. Configurer Firebase
3. Implémenter exports (PDF, CSV)
4. Ajouter système de notifications

### Moyen Terme
1. Créer backend API
2. Migrer Gemini côté serveur
3. Base de données réelle (Firestore)
4. Tests automatisés

---

## 🆘 SUPPORT

**Problème technique?**
1. Consulter les logs: `gcloud run services logs read cacrs-frontend --region=europe-west1`
2. Vérifier la console: https://console.cloud.google.com/run?project=snarecore-cacrs
3. Revoir les rapports d'audit

**Questions?**
- Consulter `RAPPORT_AUDIT_COMPLET.md`
- Consulter `RAPPORT_CORRECTIONS_DEPLOIEMENT.md`

---

## ✅ CHECKLIST FINALE

Avant de considérer l'application "prête":

- [ ] Clé Gemini configurée et testée
- [ ] OAuth Google configuré et testé
- [ ] Logo CACRS ajouté
- [ ] Tous les flows testés (login, admin, user, upload, chat)
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Tests de charge effectués
- [ ] Documentation utilisateur créée

---

**L'application est déployée et fonctionnelle. Configurez les clés API pour activer toutes les fonctionnalités !** 🚀

**URL:** https://cacrs-frontend-e3cni43iqq-ew.a.run.app
