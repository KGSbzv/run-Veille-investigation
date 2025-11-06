# 📊 GUIDE DE MONITORING PRODUCTION - CACRS

## Configuration Complète du Monitoring

### 1. 🔍 Core Web Vitals (RUM - Real User Monitoring)

**Installation web-vitals:**
```bash
npm install web-vitals
```

**Intégration dans src/index.tsx:**
```typescript
import { initWebVitals } from './utils/webVitals';

// Après ReactDOM.render
if (process.env.NODE_ENV === 'production') {
  initWebVitals();
}
```

**Métriques capturées:**
- **LCP** (Largest Contentful Paint): Performance visuelle
- **INP** (Interaction to Next Paint): Interactivité
- **CLS** (Cumulative Layout Shift): Stabilité visuelle
- **FCP** (First Contentful Paint): Premier rendu
- **TTFB** (Time to First Byte): Latence serveur

---

### 2. 🐛 Sentry - Error Tracking

**Installation:**
```bash
npm install @sentry/react @sentry/tracing
```

**Configuration src/utils/sentry.ts:**
```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (process.env.NODE_ENV !== 'production') return;
  
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay(),
    ],
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% des transactions
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% sessions normales
    replaysOnErrorSampleRate: 1.0, // 100% sessions avec erreurs
    
    // Environnement
    environment: 'production',
    release: `cacrs@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    
    // Filtres
    beforeSend(event) {
      // Ne pas envoyer erreurs dev
      if (event.request?.url?.includes('localhost')) {
        return null;
      }
      return event;
    },
  });
}
```

**Obtenir DSN Sentry:**
1. Créer compte gratuit: https://sentry.io/signup/
2. Créer projet React
3. Copier DSN dans `.env.local`:
   ```
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

---

### 3. 📈 Google Analytics 4 + Web Vitals

**Ajouter dans index.html (avant </head>):**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Obtenir ID GA4:**
1. Créer propriété GA4: https://analytics.google.com
2. Copier Measurement ID (G-XXXXXXXXXX)
3. Remplacer dans index.html

**Dashboard Web Vitals dans GA4:**
- Aller dans Rapports > Engagement > Pages
- Ajouter dimensions personnalisées:
  - `metric_name` (LCP, INP, CLS)
  - `metric_value`
  - `metric_rating` (good, needs-improvement, poor)

---

### 4. ⏱️ UptimeRobot - Monitoring Uptime

**Configuration (gratuit):**
1. Créer compte: https://uptimerobot.com/signUp
2. Ajouter monitor:
   - Type: HTTPS
   - URL: `https://cacrs-frontend-e3cni43iqq-ew.a.run.app`
   - Interval: 5 minutes
   - Alertes: Email

3. Ajouter monitor API (si backend séparé):
   - Type: HTTP(s)
   - URL: `https://your-api.com/health`
   - Interval: 5 minutes

4. Configurer alertes:
   - Email
   - SMS (payant)
   - Webhook Slack/Discord

**Badge Status (optionnel pour README):**
```markdown
![Uptime](https://img.shields.io/uptimerobot/ratio/7/m123456789)
```

---

### 5. 📊 Cloud Monitoring (GCP)

**Dashboards automatiques:**
https://console.cloud.google.com/run/detail/europe-west1/cacrs-frontend/metrics

**Métriques disponibles:**
- Requêtes/sec
- Latence p50, p95, p99
- Erreurs 4xx, 5xx
- CPU & Mémoire
- Instances actives

**Créer alertes:**
```bash
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="CACRS High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

---

### 6. 📧 Alertes Email Automatiques

**Configuration CloudWatch/Alerting:**

**Alert 1: Erreur Rate > 5%**
- Métrique: Error rate
- Seuil: > 5%
- Durée: 5 minutes
- Action: Email + SMS

**Alert 2: Latence p95 > 2s**
- Métrique: Request latency
- Seuil: > 2000ms (p95)
- Durée: 10 minutes
- Action: Email

**Alert 3: Downtime**
- Via UptimeRobot
- Immédiat
- Action: Email + SMS

---

### 7. 🔧 Logs Structurés

**Frontend logging (production):**
```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ level: 'info', message, data, timestamp: new Date().toISOString() }));
    }
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.message, 
      stack: error?.stack,
      timestamp: new Date().toISOString() 
    }));
    
    // Envoyer à Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error || new Error(message));
    }
  },
};
```

**Consulter logs Cloud Run:**
```bash
gcloud run services logs read cacrs-frontend --region=europe-west1 --limit=100
```

---

### 8. 📱 Dashboard Unifié (Optionnel)

**Grafana Cloud (gratuit):**
1. Créer compte: https://grafana.com/auth/sign-up/create-user
2. Connecter sources:
   - Prometheus (métriques)
   - Loki (logs)
   - Google Cloud Monitoring

3. Import dashboard CACRS:
   - Request rate
   - Error rate
   - Latency (p50, p95, p99)
   - Core Web Vitals
   - Active users

---

## 📋 CHECKLIST MONITORING

### Configuration Initiale
- [ ] web-vitals installé et configuré
- [ ] GA4 tracking ajouté (Measurement ID)
- [ ] Sentry configuré (DSN)
- [ ] UptimeRobot monitors créés
- [ ] Cloud Monitoring dashboards consultés
- [ ] Alertes email configurées

### Tests
- [ ] Test erreur JavaScript (Sentry capture)
- [ ] Test métrique LCP (visible dans GA4)
- [ ] Test downtime (UptimeRobot alerte)
- [ ] Test logs Cloud Run (visibles)

### Production
- [ ] Vérifier données après 24h
- [ ] Ajuster seuils alertes
- [ ] Créer runbook incidents
- [ ] Former équipe sur dashboards

---

## 🎯 SEUILS D'ALERTE RECOMMANDÉS

| Métrique | Warning | Critical | Action |
|---|---|---|---|
| **Uptime** | < 99.9% | < 99.5% | Investiguer immédiatement |
| **Error Rate** | > 2% | > 5% | Rollback si nécessaire |
| **Latency p95** | > 1s | > 2s | Optimiser backend |
| **LCP p75** | > 2.5s | > 4s | Optimiser frontend |
| **CLS p75** | > 0.1 | > 0.25 | Corriger layouts |
| **INP p75** | > 200ms | > 500ms | Optimiser JS |

---

## 🚨 RUNBOOK INCIDENTS

### Incident: Site Down

**1. Vérification rapide:**
```bash
curl -I https://cacrs-frontend-e3cni43iqq-ew.a.run.app
gcloud run services describe cacrs-frontend --region=europe-west1
```

**2. Logs dernières erreurs:**
```bash
gcloud run services logs read cacrs-frontend --region=europe-west1 --limit=50
```

**3. Rollback si nécessaire:**
```bash
gcloud run services update-traffic cacrs-frontend --region=europe-west1 \
  --to-revisions=PREVIOUS_REVISION=100
```

### Incident: Erreur Rate Élevé

**1. Identifier erreurs Sentry:**
- Aller sur sentry.io/issues
- Filtrer par "unresolved"
- Analyser stack traces

**2. Vérifier logs:**
```bash
gcloud run services logs read cacrs-frontend --region=europe-west1 --format=json | grep ERROR
```

**3. Fix + Redeploy:**
```bash
# Corriger code
git commit -m "fix: résolution erreur critique"
git push
gcloud builds submit --config=cloudbuild.yaml .
```

---

**Documentation complète monitoring: Voir `/docs/monitoring.md`**
