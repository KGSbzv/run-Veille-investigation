import React, { useState, useEffect } from 'react';
import { ServiceConfig, ServiceStatus, ServiceType, AIModelConfig } from '../types/services';
import { getAllServices, updateService, testService } from '../services/servicesManager';
import { initializeServices } from '../services/servicesManager';
import { servicesRegistry } from '../config/servicesRegistry';
import Spinner from '../components/ui/Spinner';
import { CheckCircle2Icon, XCircleIcon, AlertCircleIcon, SaveIcon, PlayIcon } from '../components/ui/Icons';

const AdminServicesSettings: React.FC = () => {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ServiceType | 'ai' | 'enabled'>('all');
  const [testingService, setTestingService] = useState<string | null>(null);
  const [savingService, setSavingService] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    // Initialize with registry data first time
    initializeServices(servicesRegistry);
    const data = await getAllServices();
    setServices(data);
    setLoading(false);
  };

  const handleToggleEnabled = async (serviceId: string, enabled: boolean) => {
    setSavingService(serviceId);
    const updated = await updateService(serviceId, { enabled });
    if (updated) {
      setServices(prev => prev.map(s => s.serviceId === serviceId ? updated : s));
    }
    setSavingService(null);
  };

  const handleUpdateSecret = async (serviceId: string, secretName: string) => {
    setSavingService(serviceId);
    const updated = await updateService(serviceId, { secretName });
    if (updated) {
      setServices(prev => prev.map(s => s.serviceId === serviceId ? updated : s));
    }
    setSavingService(null);
  };

  const handleUpdateAIConfig = async (serviceId: string, field: string, value: any) => {
    const service = services.find(s => s.serviceId === serviceId);
    if (!service || !service.aiConfig) return;

    const updatedAIConfig = { ...service.aiConfig, [field]: value } as AIModelConfig;
    const updated = await updateService(serviceId, { aiConfig: updatedAIConfig });
    if (updated) {
      setServices(prev => prev.map(s => s.serviceId === serviceId ? updated : s));
    }
  };

  const handleTestService = async (serviceId: string) => {
    setTestingService(serviceId);
    const result = await testService(serviceId);
    const updated = await getAllServices();
    setServices(updated);
    setTestingService(null);
    
    if (result.status === ServiceStatus.OK) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ ${result.message}`);
    }
  };

  const getFilteredServices = () => {
    if (filter === 'all') return services;
    if (filter === 'enabled') return services.filter(s => s.enabled);
    if (filter === 'ai') {
      return services.filter(s => 
        [ServiceType.GEMINI, ServiceType.OPENAI, ServiceType.ANTHROPIC, 
         ServiceType.DEEPSEEK, ServiceType.REKA, ServiceType.VERTEX_AI].includes(s.serviceType)
      );
    }
    return services.filter(s => s.serviceType === filter);
  };

  const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
    switch (status) {
      case ServiceStatus.OK:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-900/30 text-green-400">
          <CheckCircle2Icon className="w-3 h-3 mr-1" /> OK
        </span>;
      case ServiceStatus.ERROR:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-900/30 text-red-400">
          <XCircleIcon className="w-3 h-3 mr-1" /> Erreur
        </span>;
      case ServiceStatus.DISABLED:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/30 text-gray-400">
          Désactivé
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-900/30 text-yellow-400">
          <AlertCircleIcon className="w-3 h-3 mr-1" /> Non testé
        </span>;
    }
  };

  const ServiceCard: React.FC<{ service: ServiceConfig }> = ({ service }) => {
    const [localSecretName, setLocalSecretName] = useState(service.secretName);
    const [isEditing, setIsEditing] = useState(false);
    const isAIService = service.aiConfig !== undefined;

    return (
      <div className="bg-dark-card border border-gray-700 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dark-text">{service.displayName}</h3>
            <p className="text-sm text-dark-text-secondary mt-1">{service.description}</p>
            <div className="mt-2">
              <StatusBadge status={service.lastCheckStatus} />
              {service.lastCheckAt && (
                <span className="text-xs text-dark-text-secondary ml-2">
                  Vérifié: {new Date(service.lastCheckAt).toLocaleString('fr-FR')}
                </span>
              )}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={service.enabled}
              onChange={(e) => handleToggleEnabled(service.serviceId, e.target.checked)}
              disabled={savingService === service.serviceId}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
          </label>
        </div>

        {/* Secret Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-text mb-2">
            Nom du secret (sans le chemin complet)
            <span className="text-xs text-dark-text-secondary ml-2">
              (projects/9546768441/secrets/ sera ajouté automatiquement)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 bg-dark-bg border border-gray-600 rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={isEditing ? localSecretName : service.secretName}
              onChange={(e) => {
                setLocalSecretName(e.target.value);
                setIsEditing(true);
              }}
              placeholder="GEMINI_API_KEY"
            />
            {isEditing && (
              <button
                onClick={() => {
                  handleUpdateSecret(service.serviceId, localSecretName);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/80 text-dark-bg rounded-md flex items-center gap-2"
                disabled={savingService === service.serviceId}
              >
                <SaveIcon className="w-4 h-4" />
                Sauvegarder
              </button>
            )}
          </div>
          <p className="text-xs text-dark-text-secondary mt-1">
            Chemin complet: <code className="bg-dark-bg px-1 py-0.5 rounded">
              projects/9546768441/secrets/{service.secretName}
            </code>
          </p>
        </div>

        {/* Base URL & Region */}
        {(service.baseUrl || service.region) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {service.baseUrl && (
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">Base URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-md text-dark-text text-sm"
                  value={service.baseUrl}
                  readOnly
                />
              </div>
            )}
            {service.region && (
              <div>
                <label className="block text-sm font-medium text-dark-text mb-1">Région</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-dark-bg border border-gray-600 rounded-md text-dark-text text-sm"
                  value={service.region}
                  readOnly
                />
              </div>
            )}
          </div>
        )}

        {/* AI-specific configuration */}
        {isAIService && service.aiConfig && (
          <div className="bg-dark-bg border border-gray-600 rounded-md p-4 mb-4">
            <h4 className="text-sm font-semibold text-dark-text mb-3">Configuration IA</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-dark-text-secondary mb-1">Provider</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 bg-dark-card border border-gray-600 rounded text-dark-text text-sm"
                  value={service.aiConfig.provider}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-dark-text-secondary mb-1">Model</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 bg-dark-card border border-gray-600 rounded text-dark-text text-sm"
                  value={service.aiConfig.model}
                  onChange={(e) => handleUpdateAIConfig(service.serviceId, 'model', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-dark-text-secondary mb-1">Temperature</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  className="w-full px-2 py-1 bg-dark-card border border-gray-600 rounded text-dark-text text-sm"
                  value={service.aiConfig.temperature}
                  onChange={(e) => handleUpdateAIConfig(service.serviceId, 'temperature', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-xs text-dark-text-secondary mb-1">Max Tokens</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 bg-dark-card border border-gray-600 rounded text-dark-text text-sm"
                  value={service.aiConfig.maxOutputTokens}
                  onChange={(e) => handleUpdateAIConfig(service.serviceId, 'maxOutputTokens', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={() => handleTestService(service.serviceId)}
          disabled={!service.enabled || testingService === service.serviceId}
          className="px-4 py-2 bg-brand-lightblue hover:bg-brand-blue text-white rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testingService === service.serviceId ? (
            <><Spinner size={16} /> Test en cours...</>
          ) : (
            <><PlayIcon className="w-4 h-4" /> Tester la connexion</>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={48} />
      </div>
    );
  }

  const filteredServices = getFilteredServices();

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Services & IA / Secrets</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-brand-accent text-dark-bg' : 'bg-dark-card text-dark-text border border-gray-700'}`}
        >
          Tous ({services.length})
        </button>
        <button
          onClick={() => setFilter('enabled')}
          className={`px-4 py-2 rounded-md ${filter === 'enabled' ? 'bg-brand-accent text-dark-bg' : 'bg-dark-card text-dark-text border border-gray-700'}`}
        >
          Activés ({services.filter(s => s.enabled).length})
        </button>
        <button
          onClick={() => setFilter('ai')}
          className={`px-4 py-2 rounded-md ${filter === 'ai' ? 'bg-brand-accent text-dark-bg' : 'bg-dark-card text-dark-text border border-gray-700'}`}
        >
          Services IA ({services.filter(s => s.aiConfig).length})
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-brand-lightblue/10 border border-brand-lightblue/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-brand-lightblue mb-2">💡 Instructions</h3>
        <ul className="text-sm text-dark-text-secondary space-y-1">
          <li>• Saisissez uniquement le <strong>nom du secret</strong> (ex: GEMINI_API_KEY)</li>
          <li>• Le chemin complet <code className="bg-dark-bg px-1 rounded">projects/9546768441/secrets/</code> sera automatiquement ajouté</li>
          <li>• Activez un service pour l'utiliser dans l'application</li>
          <li>• Testez la connexion après configuration pour vérifier que tout fonctionne</li>
          <li>• Les services en erreur seront automatiquement désactivés</li>
        </ul>
      </div>

      {/* Services List */}
      <div>
        {filteredServices.map(service => (
          <ServiceCard key={service.serviceId} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-dark-text-secondary">
          Aucun service ne correspond aux filtres sélectionnés
        </div>
      )}
    </div>
  );
};

export default AdminServicesSettings;
