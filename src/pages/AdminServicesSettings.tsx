import React, { useState, useEffect } from 'react';
import { ServiceConfig, ServiceStatus, ServiceType } from '../types/services';
import { getAllServices, updateService, testService } from '../services/servicesManager';
import Spinner from '../components/ui/Spinner';
import { CheckCircle2Icon, XCircleIcon, AlertCircleIcon } from '../components/ui/Icons';

const AdminServicesSettings: React.FC = () => {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await getAllServices();
    setServices(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Services & IA / Secrets</h1>
      <div className="bg-dark-card border border-gray-700 rounded-lg p-6">
        <p className="text-dark-text-secondary">Configuration des services (en cours de développement)</p>
        <p className="text-sm text-dark-text-secondary mt-2">
          Total services: {services.length}
        </p>
      </div>
    </div>
  );
};

export default AdminServicesSettings;
