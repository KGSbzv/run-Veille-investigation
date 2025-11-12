// Types for Services & Secrets Management

export enum ServiceType {
  // AI Services
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  DEEPSEEK = 'DEEPSEEK',
  REKA = 'REKA',
  VERTEX_AI = 'VERTEX_AI',
  
  // Google Cloud Services
  FIREBASE = 'FIREBASE',
  GCP_STORAGE = 'GCP_STORAGE',
  GCP_BIGQUERY = 'GCP_BIGQUERY',
  GCP_PUBSUB = 'GCP_PUBSUB',
  
  // External APIs
  TWITTER_API = 'TWITTER_API',
  ABSTRACT_API = 'ABSTRACT_API',
  IP_INTELLIGENCE = 'IP_INTELLIGENCE',
  EMAIL_PROVIDER = 'EMAIL_PROVIDER',
  ENRICHMENT_API = 'ENRICHMENT_API',
  
  // Other
  CUSTOM = 'CUSTOM',
}

export enum ServiceStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  DISABLED = 'DISABLED',
  UNTESTED = 'UNTESTED',
}

export interface ServiceConfig {
  serviceId: string;
  displayName: string;
  serviceType: ServiceType;
  description: string;
  secretName: string;
  enabled: boolean;
  lastCheckStatus: ServiceStatus;
  lastCheckAt?: string;
  lastError?: string;
  
  baseUrl?: string;
  region?: string;
  timeoutMs?: number;
  rateLimit?: number;
  
  aiConfig?: AIModelConfig;
}

export interface AIModelConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  systemPromptProfile?: string;
}

export interface ServiceTestResult {
  status: ServiceStatus;
  errorCode?: string;
  message: string;
  checkedAt: string;
}

export interface ServiceRegistry {
  [serviceId: string]: ServiceConfig;
}
