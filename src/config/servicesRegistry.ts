import { ServiceConfig, ServiceType, ServiceStatus } from '../types/services';

export const servicesRegistry: ServiceConfig[] = [
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
    description: 'Alternative AI model for advanced analysis and reasoning',
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
];

export const getServiceById = (serviceId: string): ServiceConfig | undefined => {
  return servicesRegistry.find(s => s.serviceId === serviceId);
};
