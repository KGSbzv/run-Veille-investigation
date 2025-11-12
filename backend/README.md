# CACRS Backend API

Backend Node.js/Express pour CACRS - Centre d'Analyse du Contre-Renseignement et de la Sécurité

## Stack Technique

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15+ (avec pgvector pour RAG)
- **Cache**: Redis 7+
- **Auth**: Google OAuth 2.0 + JWT
- **Cloud**: Google Cloud Platform
- **Secrets**: Google Secret Manager

## Installation

\`\`\`bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local

# Edit .env.local with your configuration

# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed

# Start development server
npm run dev
\`\`\`

## Structure

\`\`\`
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── index.js         # Entry point
├── tests/               # Test files
├── .env.example         # Environment template
└── package.json
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/role` - Update role (admin)
- `PUT /api/users/:id/status` - Update status (admin)

### Cases
- `GET /api/cases` - List cases
- `GET /api/cases/:id` - Get case
- `POST /api/cases` - Create case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Messages (Chat)
- `GET /api/cases/:id/messages` - List messages
- `POST /api/cases/:id/messages` - Send message (with AI)

### Services
- `GET /api/admin/services` - List all services (admin)
- `GET /api/admin/services/:id` - Get service config (admin)
- `PUT /api/admin/services/:id` - Update service (admin)
- `POST /api/admin/services/:id/test` - Test service (admin)

### Health
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics (if enabled)

## Environment Variables

See `.env.example` for all required variables.

## Development

\`\`\`bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
\`\`\`

## Deployment

### Google Cloud Run

\`\`\`bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/cacrs-backend .

# Push to GCR
docker push gcr.io/PROJECT_ID/cacrs-backend

# Deploy to Cloud Run
gcloud run deploy cacrs-backend \\
  --image gcr.io/PROJECT_ID/cacrs-backend \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars="NODE_ENV=production"
\`\`\`

## Security

- JWT tokens with short expiration
- Google OAuth verification on every request
- Role-based access control (RBAC)
- Rate limiting (100 req/15min global, 10 req/min AI)
- Helmet.js for security headers
- Input validation with Joi
- SQL injection prevention with parameterized queries

## License

Proprietary - All rights reserved
