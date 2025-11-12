#!/bin/bash

set -e

echo "🧪 CACRS - Suite de Tests Complète"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}➡️  $1${NC}"
}

# 1. TypeScript Linting
print_info "1/6 Vérification TypeScript..."
npm run lint
print_status $? "TypeScript lint"
echo ""

# 2. Build
print_info "2/6 Build de production..."
npm run build
print_status $? "Build"
echo ""

# 3. Smoke Tests
print_info "3/6 Smoke tests (vérifications critiques)..."
npm run test -- smoke.spec.ts
print_status $? "Smoke tests"
echo ""

# 4. E2E Tests - Login
print_info "4/6 Tests E2E - Login..."
npm run test -- login.spec.ts
print_status $? "Login tests"
echo ""

# 5. E2E Tests - Admin
print_info "5/6 Tests E2E - Administration..."
npm run test -- admin-users.spec.ts admin-services.spec.ts
print_status $? "Admin tests"
echo ""

# 6. Accessibility Tests
print_info "6/6 Tests d'accessibilité..."
npm run test -- accessibility.spec.ts
print_status $? "Accessibility tests"
echo ""

echo "=================================="
echo -e "${GREEN}✅ TOUS LES TESTS SONT PASSÉS!${NC}"
echo "=================================="
echo ""
echo "📊 Résumé:"
echo "  - TypeScript: ✅"
echo "  - Build: ✅"
echo "  - Smoke tests: ✅"
echo "  - Login tests: ✅"
echo "  - Admin tests: ✅"
echo "  - Accessibility: ✅"
echo ""
echo "🚀 Le projet est prêt pour le déploiement!"
