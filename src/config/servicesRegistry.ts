import { ServiceConfig, ServiceType, ServiceStatus } from '../types/services';

export const servicesRegistry: ServiceConfig[] = [
  // AI Services  
  {
    serviceId: 'gemini',
    displayName: 'Google Gemini',
    serviceType: ServiceType.GEMINI,
    description: 'Primary AI model for chat, analysis, and report generation',
    secretName: 'GEMINI_API_KEY',
    enabled: true,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://generativelanguage.googleapis.com',
    aiConfig: {
      provider: 'Google',
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      maxOutputTokens: 8192,
      topP: 0.95,
    },
  },
  {
    serviceId: 'anthropic',
    displayName: 'Anthropic Claude',
    serviceType: ServiceType.ANTHROPIC,
    description: 'Alternative AI model for advanced analysis',
    secretName: 'ANTHROPIC_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://api.anthropic.com',
    aiConfig: {
      provider: 'Anthropic',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  },
  {
    serviceId: 'openai',
    displayName: 'OpenAI GPT',
    serviceType: ServiceType.OPENAI,
    description: 'OpenAI models for specialized tasks',
    secretName: 'OPENAI_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://api.openai.com/v1',
    aiConfig: {
      provider: 'OpenAI',
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  },
  {
    serviceId: 'deepseek',
    displayName: 'DeepSeek',
    serviceType: ServiceType.DEEPSEEK,
    description: 'DeepSeek AI for code analysis',
    secretName: 'DEEPSEEK_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://api.deepseek.com',
    aiConfig: {
      provider: 'DeepSeek',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  },
  {
    serviceId: 'reka',
    displayName: 'Reka AI',
    serviceType: ServiceType.REKA,
    description: 'Reka multimodal analysis',
    secretName: 'REKA_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://api.reka.ai',
    aiConfig: {
      provider: 'Reka',
      model: 'reka-core',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  },
  
  // Google Cloud Services
  {
    serviceId: 'vertex-ai',
    displayName: 'Vertex AI',
    serviceType: ServiceType.VERTEX_AI,
    description: 'ML orchestration and model serving',
    secretName: 'VERTEX_AI_CREDENTIALS',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    region: 'us-central1',
  },
  {
    serviceId: 'firebase',
    displayName: 'Firebase',
    serviceType: ServiceType.FIREBASE,
    description: 'Authentication and real-time data',
    secretName: 'FIREBASE_CONFIG',
    enabled: true,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  {
    serviceId: 'gcp-storage',
    displayName: 'Cloud Storage',
    serviceType: ServiceType.GCP_STORAGE,
    description: 'File storage and backups',
    secretName: 'GCP_STORAGE_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  {
    serviceId: 'bigquery',
    displayName: 'BigQuery',
    serviceType: ServiceType.GCP_BIGQUERY,
    description: 'Analytics data warehouse',
    secretName: 'BIGQUERY_CREDENTIALS',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  {
    serviceId: 'pubsub',
    displayName: 'Cloud Pub/Sub',
    serviceType: ServiceType.GCP_PUBSUB,
    description: 'Messaging and events',
    secretName: 'PUBSUB_CREDENTIALS',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  
  // External APIs
  {
    serviceId: 'twitter-api',
    displayName: 'Twitter/X API',
    serviceType: ServiceType.TWITTER_API,
    description: 'Social media intelligence',
    secretName: 'TWITTER_BEARER_TOKEN',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://api.twitter.com/2',
    rateLimit: 500,
  },
  {
    serviceId: 'abstract-api',
    displayName: 'Abstract API',
    serviceType: ServiceType.ABSTRACT_API,
    description: 'Email validation and enrichment',
    secretName: 'ABSTRACT_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
    baseUrl: 'https://emailvalidation.abstractapi.com/v1',
  },
  {
    serviceId: 'ip-intelligence',
    displayName: 'IP Intelligence',
    serviceType: ServiceType.IP_INTELLIGENCE,
    description: 'IP geolocation and threat intel',
    secretName: 'IP_INTELLIGENCE_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  {
    serviceId: 'email-provider',
    displayName: 'Email Provider',
    serviceType: ServiceType.EMAIL_PROVIDER,
    description: 'Transactional emails',
    secretName: 'EMAIL_PROVIDER_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
  {
    serviceId: 'enrichment-api',
    displayName: 'Data Enrichment',
    serviceType: ServiceType.ENRICHMENT_API,
    description: 'Person/company data enrichment',
    secretName: 'ENRICHMENT_API_KEY',
    enabled: false,
    lastCheckStatus: ServiceStatus.UNTESTED,
  },
];

export const getServiceById = (serviceId: string): ServiceConfig | undefined => {
  return servicesRegistry.find(s => s.serviceId === serviceId);
};

export const getEnabledServices = (): ServiceConfig[] => {
  return servicesRegistry.filter(s => s.enabled);
};

export const getServicesByType = (type: ServiceType): ServiceConfig[] => {
  return servicesRegistry.filter(s => s.serviceType === type);
};
