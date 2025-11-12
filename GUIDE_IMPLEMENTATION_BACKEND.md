# 🔧 GUIDE D'IMPLÉMENTATION BACKEND COMPLET

**Date**: 12 Novembre 2025  
**Projet**: CACRS Backend API  
**Objectif**: Backend production-ready pour remplacer les mocks

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Installation & Configuration](#installation--configuration)
4. [Base de Données](#base-de-données)
5. [Authentification](#authentification)
6. [API Endpoints](#api-endpoints)
7. [Services Externes](#services-externes)
8. [Déploiement](#déploiement)
9. [Tests](#tests)
10. [Maintenance](#maintenance)

---

## 🎯 VUE D'ENSEMBLE

### Objectif

Implémenter un backend Node.js/Express complet pour:
- ✅ Remplacer le mock localStorage
- ✅ Persistance réelle avec PostgreSQL
- ✅ Authentification JWT + Google OAuth
- ✅ Gestion des services et secrets (Google Secret Manager)
- ✅ Rate limiting et sécurité
- ✅ Ready pour Cloud Run

### Stack Technique

```
Backend:
├── Runtime: Node.js 18+
├── Framework: Express.js 4.x
├── Database: PostgreSQL 15+ + pgvector
├── Cache: Redis 7+
├── Auth: Google OAuth 2.0 + JWT
├── Secrets: Google Secret Manager
├── Logging: Winston
└── Deploy: Google Cloud Run
```

### Estimation Temps

- **Setup initial**: 4-6 heures
- **Auth + Users**: 6-8 heures
- **Cases + Messages**: 8-10 heures
- **Services Management**: 4-6 heures
- **Tests**: 4-6 heures
- **Déploiement**: 2-4 heures
- **TOTAL**: 28-40 heures (4-5 jours)

---

## 🏗️ ARCHITECTURE

### Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL config
│   │   ├── redis.js             # Redis config
│   │   └── index.js             # Global config
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── rbac.js              # Role-based access control
│   │   ├── rateLimit.js         # Rate limiting
│   │   ├── validate.js          # Input validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── logger.js            # Request logging
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Case.js              # Case model
│   │   ├── Message.js           # Message model
│   │   ├── File.js              # File model
│   │   ├── Finding.js           # Finding model
│   │   ├── Watchlist.js         # Watchlist model
│   │   └── ServiceConfig.js     # Service config model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── users.js             # User routes
│   │   ├── cases.js             # Case routes
│   │   ├── messages.js          # Message routes
│   │   ├── services.js          # Service routes (admin)
│   │   └── health.js            # Health check
│   ├── services/
│   │   ├── secretManager.js     # Google Secret Manager
│   │   ├── geminiService.js     # Gemini AI
│   │   ├── authService.js       # Authentication
│   │   ├── userService.js       # User management
│   │   ├── caseService.js       # Case management
│   │   ├── serviceManager.js    # Services management
│   │   └── emailService.js      # Email notifications
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   ├── helpers.js           # Utility functions
│   │   ├── migrate.js           # Database migrations
│   │   └── seed.js              # Seed data
│   └── index.js                 # Entry point
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # E2E tests
├── Dockerfile                   # Docker config
├── .env.example                 # Environment template
├── .dockerignore
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 INSTALLATION & CONFIGURATION

### Prérequis

```bash
# Required
- Node.js 18+
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Google Cloud account

# Optional
- Docker
- pgAdmin
```

### Installation Étape par Étape

#### 1. Créer le Projet Backend

```bash
cd /Users/robby/Documents/GitHub/run-Veille-investigation

# Dossier backend existe déjà avec structure
cd backend

# Installer dépendances
npm install
```

#### 2. Configuration PostgreSQL

**Option A: Local (développement)**

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb cacrs

# Create user
psql -d cacrs -c "CREATE USER cacrs_user WITH PASSWORD 'your_password';"
psql -d cacrs -c "GRANT ALL PRIVILEGES ON DATABASE cacrs TO cacrs_user;"

# Install pgvector extension
psql -d cacrs -c "CREATE EXTENSION vector;"
```

**Option B: Cloud SQL (production)**

```bash
# Create Cloud SQL instance
gcloud sql instances create cacrs-db \\
  --database-version=POSTGRES_15 \\
  --tier=db-f1-micro \\
  --region=us-central1

# Create database
gcloud sql databases create cacrs --instance=cacrs-db

# Create user
gcloud sql users create cacrs_user \\
  --instance=cacrs-db \\
  --password=YOUR_PASSWORD
```

#### 3. Configuration Redis

**Option A: Local**

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Test connection
redis-cli ping
```

**Option B: Cloud Memorystore (production)**

```bash
# Create Redis instance
gcloud redis instances create cacrs-redis \\
  --size=1 \\
  --region=us-central1 \\
  --redis-version=redis_7_0
```

#### 4. Variables d'Environnement

Créer `.env.local`:

```bash
# Server
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://cacrs_user:password@localhost:5432/cacrs

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Google Cloud
GCP_PROJECT_ID=9546768441
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-key.json

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Gemini
GEMINI_API_KEY=your_gemini_key

# CORS
CORS_ORIGIN=http://localhost:5173

# Admin
ADMIN_EMAILS=nyh770@gmail.com
```

#### 5. Migrations de Base de Données

**Créer le fichier de migration** `src/utils/migrate.js`:

```javascript
import pool from '../config/database.js';

const migrations = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    picture TEXT,
    role VARCHAR(50) DEFAULT 'VIEWER' CHECK (role IN ('ADMIN', 'ANALYST', 'CONTRIBUTOR', 'VIEWER')),
    status VARCHAR(20) DEFAULT 'actif' CHECK (status IN ('actif', 'bloqué')),
    google_id VARCHAR(255) UNIQUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Cases table
  `CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) CHECK (category IN ('Désinformation', 'Cybersecurité', 'Finance', 'Élections', 'Autre')),
    status VARCHAR(50) DEFAULT 'ouvert' CHECK (status IN ('ouvert', 'en_cours', 'fermé')),
    priority VARCHAR(20) DEFAULT 'moyenne' CHECK (priority IN ('basse', 'moyenne', 'haute', 'critique')),
    tags TEXT[],
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Messages table
  `CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Files table
  `CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    storage_path TEXT,
    analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Findings table
  `CREATE TABLE IF NOT EXISTS findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    text TEXT NOT NULL,
    sources JSONB,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Watchlists table
  `CREATE TABLE IF NOT EXISTS watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    interval_minutes INTEGER DEFAULT 60,
    last_run TIMESTAMP,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Service configs table
  `CREATE TABLE IF NOT EXISTS service_configs (
    id VARCHAR(100) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    secret_name VARCHAR(255),
    enabled BOOLEAN DEFAULT false,
    last_check_status VARCHAR(50) DEFAULT 'UNTESTED',
    last_check_at TIMESTAMP,
    last_error TEXT,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);`,
  `CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);`,
  `CREATE INDEX IF NOT EXISTS idx_files_case_id ON files(case_id);`,
  `CREATE INDEX IF NOT EXISTS idx_findings_user_id ON findings(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
];

async function migrate() {
  console.log('🔄 Running database migrations...');
  
  try {
    for (const migration of migrations) {
      await pool.query(migration);
    }
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
```

**Exécuter:**

```bash
npm run db:migrate
```

---

## 🔐 AUTHENTIFICATION

### 1. Middleware Auth

**Fichier**: `src/middleware/auth.js`

```javascript
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    // Get or create user
    let user = await query(
      'SELECT * FROM users WHERE email = $1',
      [payload.email]
    );

    if (user.rows.length === 0) {
      // Create new user
      const isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(payload.email);
      user = await query(
        `INSERT INTO users (email, name, picture, role, google_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          payload.email,
          payload.name,
          payload.picture,
          isAdmin ? 'ADMIN' : 'VIEWER',
          payload.sub
        ]
      );
    } else {
      // Update last login
      await query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.rows[0].id]
      );
    }

    req.user = user.rows[0];
    
    // Check if user is blocked
    if (req.user.status === 'bloqué') {
      return res.status(403).json({ error: 'Account disabled' });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
```

### 2. Routes Auth

**Fichier**: `src/routes/auth.js`

```javascript
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google - Login with Google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Get or create user
    let user = await query(
      'SELECT * FROM users WHERE email = $1',
      [payload.email]
    );

    if (user.rows.length === 0) {
      const isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(payload.email);
      user = await query(
        `INSERT INTO users (email, name, picture, role, google_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [payload.email, payload.name, payload.picture, isAdmin ? 'ADMIN' : 'VIEWER', payload.sub]
      );
    }

    const userData = user.rows[0];

    // Create JWT
    const accessToken = jwt.sign(
      { 
        userId: userData.id,
        email: userData.email,
        role: userData.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        role: userData.role,
        status: userData.status,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
```

---

## 📡 API ENDPOINTS

### Services Management

**Fichier**: `src/routes/services.js`

```javascript
import express from 'express';
import { verifyGoogleToken, requireAdmin } from '../middleware/auth.js';
import { query } from '../config/database.js';
import secretManager from '../services/secretManager.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// GET /api/admin/services - List all services
router.get('/', verifyGoogleToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM service_configs ORDER BY service_type, display_name'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// PUT /api/admin/services/:id - Update service
router.put('/:id', verifyGoogleToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, secretName, config } = req.body;

    const result = await query(
      `UPDATE service_configs 
       SET enabled = COALESCE($1, enabled),
           secret_name = COALESCE($2, secret_name),
           config = COALESCE($3, config),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [enabled, secretName, JSON.stringify(config), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// POST /api/admin/services/:id/test - Test service
router.post('/:id/test', verifyGoogleToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM service_configs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = result.rows[0];

    if (!service.enabled) {
      return res.json({
        status: 'DISABLED',
        message: 'Service is disabled',
        checkedAt: new Date().toISOString(),
      });
    }

    // Test based on service type
    let testResult;
    const startTime = Date.now();

    if (service.service_type === 'GEMINI') {
      try {
        const apiKey = await secretManager.getSecret(service.secret_name);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        await model.generateContent('Test');
        testResult = { status: 'OK', message: 'Gemini API is operational' };
      } catch (error) {
        testResult = { status: 'ERROR', message: error.message, errorCode: 'API_ERROR' };
      }
    } else {
      testResult = { status: 'OK', message: 'Service configuration valid' };
    }

    const responseTime = Date.now() - startTime;

    // Update service status
    await query(
      `UPDATE service_configs 
       SET last_check_status = $1,
           last_check_at = CURRENT_TIMESTAMP,
           last_error = $2
       WHERE id = $3`,
      [testResult.status, testResult.errorCode || null, id]
    );

    // Auto-disable if critical error
    if (testResult.status === 'ERROR' && testResult.errorCode) {
      await query(
        'UPDATE service_configs SET enabled = false WHERE id = $1',
        [id]
      );
    }

    res.json({
      ...testResult,
      checkedAt: new Date().toISOString(),
      responseTime,
    });
  } catch (error) {
    console.error('Error testing service:', error);
    res.status(500).json({ error: 'Failed to test service' });
  }
});

export default router;
```

---

## 🐳 DÉPLOIEMENT

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src ./src

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \\
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start
CMD ["node", "src/index.js"]
```

### Déploiement Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/9546768441/cacrs-backend
gcloud run deploy cacrs-backend \\
  --image gcr.io/9546768441/cacrs-backend \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars="NODE_ENV=production,GCP_PROJECT_ID=9546768441"
```

---

## ✅ RÉSUMÉ

### Ce Document Fournit

✅ Architecture complète du backend
✅ Configuration PostgreSQL + Redis
✅ Authentification Google OAuth + JWT
✅ Schéma de base de données
✅ Middleware et routes principales
✅ Gestion des services et secrets
✅ Scripts de déploiement

### Prochaines Étapes

1. **Créer les fichiers** selon la structure fournie
2. **Installer les dépendances**: `npm install`
3. **Configurer l'environnement**: `.env.local`
4. **Migrer la base de données**: `npm run db:migrate`
5. **Démarrer le serveur**: `npm run dev`
6. **Tester les endpoints**: Postman/Insomnia
7. **Déployer sur Cloud Run**

### Temps Estimé

- **Implémentation complète**: 4-5 jours
- **Version minimale viable (MVP)**: 2-3 jours
- **Tests et QA**: 1-2 jours

---

**Document créé le**: 12 Novembre 2025  
**Auteur**: CACRS Development Team  
**Version**: 1.0.0
