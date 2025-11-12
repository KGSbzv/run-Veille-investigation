# 🚀 QUICKSTART - CACRS

**Démarrage en 5 minutes!**

---

## 1. Installation Rapide

\`\`\`bash
# Cloner (si pas déjà fait)
cd /Users/robby/Documents/GitHub/run-Veille-investigation

# Installer dépendances
npm install

# Copier config
cp .env.example .env.local
\`\`\`

---

## 2. Configuration Minimale

Éditer `.env.local`:

\`\`\`bash
# Obligatoire
VITE_GEMINI_API_KEY=<votre_clé_ici>
VITE_GOOGLE_CLIENT_ID=<votre_client_id>.apps.googleusercontent.com
\`\`\`

**Obtenir les clés**:
- Gemini: https://aistudio.google.com/app/apikey
- Google OAuth: https://console.cloud.google.com/apis/credentials

---

## 3. Lancer l'Application

\`\`\`bash
npm run dev
\`\`\`

Ouvrir: http://localhost:5173

---

## 4. Premier Test

### En tant qu'Analyste
1. **Login**: Cliquer "Sign in with Google"
2. **Dashboard**: Voir statistiques
3. **Dossiers**: Créer un nouveau dossier
4. **Chat**: Tester l'IA Gemini
5. **Veille**: Effectuer une recherche web

### En tant qu'Admin (nyh770@gmail.com)
1. **Login**: Avec compte admin
2. **Admin**: Menu Administration
3. **Services**: Tab "Services & IA / Secrets" ⭐
4. **Config**: Activer un service
5. **Test**: Tester la connexion API

---

## 5. Vérification Rapide

\`\`\`bash
# Check TypeScript
npm run lint

# Vérifier tout
./scripts/verify-project.sh
\`\`\`

---

## 🎯 C'est Tout!

Vous êtes prêt à utiliser CACRS!

**Besoin d'aide?** Voir:
- `README_NOUVEAU.md` - Documentation complète
- `GUIDE_VERIFICATION.md` - Tests
- `RAPPORT_FINAL_IMPLEMENTATION.md` - Détails techniques

---

**Pro Tip**: Utilisez le module Services & Secrets pour configurer tous vos services externes en un seul endroit! 🔐
