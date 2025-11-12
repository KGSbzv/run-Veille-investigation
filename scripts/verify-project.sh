#!/bin/bash

# CACRS - Script de Vérification Complète
# Ce script vérifie l'état du projet et génère un rapport

echo "======================================"
echo "  CACRS - Vérification du Projet"
echo "======================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
ERRORS=0
WARNINGS=0
SUCCESS=0

# Fonction de vérification
check() {
  local name=$1
  local command=$2
  
  echo -n "Vérification: $name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    ((SUCCESS++))
    return 0
  else
    echo -e "${RED}✗ ERREUR${NC}"
    ((ERRORS++))
    return 1
  fi
}

warn() {
  local message=$1
  echo -e "${YELLOW}⚠ AVERTISSEMENT: $message${NC}"
  ((WARNINGS++))
}

success() {
  local message=$1
  echo -e "${GREEN}✓ $message${NC}"
  ((SUCCESS++))
}

echo "1. Vérification de l'environnement"
echo "-----------------------------------"

check "Node.js installé" "command -v node"
check "npm installé" "command -v npm"

if command -v node > /dev/null 2>&1; then
  NODE_VERSION=$(node --version)
  echo "  Version Node.js: $NODE_VERSION"
fi

echo ""
echo "2. Vérification des dépendances"
echo "--------------------------------"

if [ -f "package.json" ]; then
  success "package.json existe"
else
  echo -e "${RED}✗ package.json manquant${NC}"
  ((ERRORS++))
fi

if [ -d "node_modules" ]; then
  success "node_modules existe"
else
  warn "node_modules manquant - exécuter: npm install"
fi

check "web-vitals installé" "npm list web-vitals"
check "@google/genai installé" "npm list @google/genai"
check "react installé" "npm list react"
check "react-router-dom installé" "npm list react-router-dom"

echo ""
echo "3. Vérification des fichiers du projet"
echo "---------------------------------------"

REQUIRED_FILES=(
  "src/types/services.ts"
  "src/config/servicesRegistry.ts"
  "src/services/servicesManager.ts"
  "src/services/geminiService.ts"
  "src/services/mockDataService.ts"
  "src/pages/AdminServicesSettings.tsx"
  "src/pages/AdminPage.tsx"
  "src/pages/LoginPage.tsx"
  "src/pages/DashboardPage.tsx"
  "src/pages/CasesPage.tsx"
  "src/pages/WatchlistsPage.tsx"
  "src/App.tsx"
  "src/index.tsx"
  "vite.config.ts"
  "tsconfig.json"
  "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    success "$file existe"
  else
    echo -e "${RED}✗ $file manquant${NC}"
    ((ERRORS++))
  fi
done

echo ""
echo "4. Vérification de la configuration"
echo "------------------------------------"

if [ -f ".env.local" ]; then
  success ".env.local existe"
  
  if grep -q "VITE_GEMINI_API_KEY" .env.local; then
    success "VITE_GEMINI_API_KEY configuré"
  else
    warn "VITE_GEMINI_API_KEY manquant dans .env.local"
  fi
  
  if grep -q "VITE_GOOGLE_CLIENT_ID" .env.local; then
    success "VITE_GOOGLE_CLIENT_ID configuré"
  else
    warn "VITE_GOOGLE_CLIENT_ID manquant dans .env.local"
  fi
else
  warn ".env.local manquant - copier depuis .env.example"
fi

echo ""
echo "5. Vérification TypeScript"
echo "--------------------------"

if npm run lint > /dev/null 2>&1; then
  success "TypeScript: 0 erreurs"
else
  echo -e "${RED}✗ Erreurs TypeScript détectées${NC}"
  echo "  Exécuter: npm run lint pour voir les détails"
  ((ERRORS++))
fi

echo ""
echo "6. Vérification du build"
echo "------------------------"

echo "Test de build (ceci peut prendre 30-60 secondes)..."

if npm run build > /tmp/build.log 2>&1; then
  success "Build production réussi"
  
  if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo "  Taille du build: $DIST_SIZE"
    
    JS_COUNT=$(find dist -name "*.js" | wc -l)
    echo "  Fichiers JS: $JS_COUNT"
    
    CSS_COUNT=$(find dist -name "*.css" | wc -l)
    echo "  Fichiers CSS: $CSS_COUNT"
  fi
else
  echo -e "${RED}✗ Build échoué${NC}"
  echo "  Voir /tmp/build.log pour les détails"
  ((ERRORS++))
fi

echo ""
echo "7. Vérification du code"
echo "-----------------------"

TS_FILES=$(find src -name "*.ts" -o -name "*.tsx" | wc -l)
echo "  Fichiers TypeScript: $TS_FILES"

COMPONENTS=$(find src/components -name "*.tsx" 2>/dev/null | wc -l)
echo "  Composants: $COMPONENTS"

PAGES=$(find src/pages -name "*.tsx" 2>/dev/null | wc -l)
echo "  Pages: $PAGES"

SERVICES=$(find src/services -name "*.ts" 2>/dev/null | wc -l)
echo "  Services: $SERVICES"

# Vérifier console.log en production (code smell)
CONSOLE_LOGS=$(grep -r "console\." src --include="*.ts" --include="*.tsx" | grep -v "console.error" | grep -v "// " | wc -l)
if [ "$CONSOLE_LOGS" -gt 5 ]; then
  warn "Trop de console.log trouvés ($CONSOLE_LOGS) - à nettoyer pour production"
fi

echo ""
echo "8. Module Services & Secrets"
echo "-----------------------------"

if [ -f "src/pages/AdminServicesSettings.tsx" ]; then
  success "Interface Admin Services implémentée"
else
  echo -e "${RED}✗ AdminServicesSettings.tsx manquant${NC}"
  ((ERRORS++))
fi

if [ -f "src/config/servicesRegistry.ts" ]; then
  SERVICES_COUNT=$(grep -c "serviceId:" src/config/servicesRegistry.ts)
  echo "  Services enregistrés: $SERVICES_COUNT"
  
  if [ "$SERVICES_COUNT" -ge 15 ]; then
    success "Nombre de services OK (>= 15)"
  else
    warn "Seulement $SERVICES_COUNT services enregistrés (attendu: 15)"
  fi
fi

echo ""
echo "9. Sécurité"
echo "-----------"

# Vérifier qu'il n'y a pas de secrets hardcodés
if grep -r "sk-.*" src --include="*.ts" --include="*.tsx" > /dev/null 2>&1; then
  echo -e "${RED}✗ Possible API key hardcodée détectée!${NC}"
  ((ERRORS++))
else
  success "Pas de secrets hardcodés détectés"
fi

# Vérifier .gitignore
if grep -q ".env.local" .gitignore; then
  success ".env.local dans .gitignore"
else
  warn ".env.local devrait être dans .gitignore"
fi

echo ""
echo "10. Documentation"
echo "-----------------"

DOCS=(
  "README.md"
  "AUDIT_COMPLET_2025.md"
  "RAPPORT_FINAL_IMPLEMENTATION.md"
  "GUIDE_VERIFICATION.md"
  "SUGGESTIONS_AMELIORATION.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    success "$doc existe"
  else
    warn "$doc manquant"
  fi
done

echo ""
echo "======================================"
echo "  RÉSUMÉ"
echo "======================================"
echo ""
echo -e "Succès:        ${GREEN}$SUCCESS${NC}"
echo -e "Avertissements: ${YELLOW}$WARNINGS${NC}"
echo -e "Erreurs:       ${RED}$ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Projet prêt pour le développement!${NC}"
  
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Aucun avertissement - Excellent!${NC}"
  else
    echo -e "${YELLOW}⚠ $WARNINGS avertissements à vérifier${NC}"
  fi
  
  echo ""
  echo "Prochaines étapes recommandées:"
  echo "1. Vérifier .env.local et configurer les clés API"
  echo "2. Lancer le serveur de dev: npm run dev"
  echo "3. Tester l'interface Admin > Services & Secrets"
  echo "4. Implémenter le backend (voir SUGGESTIONS_AMELIORATION.md)"
  echo "5. Exécuter les tests E2E: npm run test"
  
  exit 0
else
  echo -e "${RED}✗ $ERRORS erreur(s) critique(s) à corriger${NC}"
  echo ""
  echo "Actions recommandées:"
  echo "1. Corriger les erreurs TypeScript: npm run lint"
  echo "2. Vérifier les fichiers manquants"
  echo "3. Réinstaller les dépendances: npm install"
  echo "4. Consulter la documentation"
  
  exit 1
fi
