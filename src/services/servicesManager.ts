import { ServiceConfig, ServiceStatus, ServiceTestResult } from '../types/services';

// Secret Manager base path
export const SECRET_MANAGER_BASE_PATH = 'projects/9546768441/secrets';

// Build full secret path
export const getFullSecretPath = (secretName: string): string => {
  return `${SECRET_MANAGER_BASE_PATH}/${secretName}`;
};

// Mock service storage (in real app, this would be in database)
let servicesState: ServiceConfig[] = [];

export const initializeServices = (initialServices: ServiceConfig[]) => {
  servicesState = [...initialServices];
};

export const getAllServices = async (): Promise<ServiceConfig[]> => {
  return new Promise(resolve => setTimeout(() => resolve(servicesState), 300));
};

export const getServiceById = async (serviceId: string): Promise<ServiceConfig | undefined> => {
  return new Promise(resolve => 
    setTimeout(() => resolve(servicesState.find(s => s.serviceId === serviceId)), 200)
  );
};

export const updateService = async (
  serviceId: string, 
  updates: Partial<ServiceConfig>
): Promise<ServiceConfig | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = servicesState.findIndex(s => s.serviceId === serviceId);
      if (index !== -1) {
        servicesState[index] = { ...servicesState[index], ...updates };
        resolve(servicesState[index]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};

export const testService = async (serviceId: string): Promise<ServiceTestResult> => {
  const service = servicesState.find(s => s.serviceId === serviceId);
  
  if (!service) {
    return {
      status: ServiceStatus.ERROR,
      errorCode: 'SERVICE_NOT_FOUND',
      message: 'Service not found',
      checkedAt: new Date().toISOString(),
    };
  }

  if (!service.enabled) {
    return {
      status: ServiceStatus.DISABLED,
      message: 'Service is disabled',
      checkedAt: new Date().toISOString(),
    };
  }

  // Simulate API test
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate success for enabled services with secretName
      const success = service.secretName && service.secretName.length > 0;
      
      const result: ServiceTestResult = {
        status: success ? ServiceStatus.OK : ServiceStatus.ERROR,
        errorCode: success ? undefined : 'INVALID_KEY',
        message: success 
          ? `Service ${service.displayName} is operational` 
          : 'Invalid or missing API key',
        checkedAt: new Date().toISOString(),
      };

      // Update service status
      const index = servicesState.findIndex(s => s.serviceId === serviceId);
      if (index !== -1) {
        servicesState[index].lastCheckStatus = result.status;
        servicesState[index].lastCheckAt = result.checkedAt;
        servicesState[index].lastError = result.errorCode;
        
        // Auto-disable if critical error
        if (result.status === ServiceStatus.ERROR && result.errorCode) {
          servicesState[index].enabled = false;
        }
      }

      resolve(result);
    }, 1000);
  });
};

// Get service client/config for use in application
export const getServiceClient = async (serviceId: string): Promise<any> => {
  const service = await getServiceById(serviceId);
  
  if (!service) {
    throw new Error(`Service ${serviceId} not found`);
  }
  
  if (!service.enabled) {
    throw new Error(`Service ${serviceId} is disabled`);
  }
  
  if (service.lastCheckStatus === ServiceStatus.ERROR) {
    throw new Error(`Service ${serviceId} has errors: ${service.lastError}`);
  }
  
  return {
    config: service,
    secretPath: getFullSecretPath(service.secretName),
  };
};
