import React, { useState, useEffect } from 'react';
import { getAlerts } from '../../services/mockDataService';
import { Alert, AlertSeverity } from '../../types';
import Spinner from '../ui/Spinner';
import { AlertTriangleIcon } from '../ui/Icons';

const severityStyles = {
    [AlertSeverity.HIGH]: {
        iconColor: 'text-red-500',
        borderColor: 'border-red-500/30',
        bgColor: 'bg-red-500/10',
    },
    [AlertSeverity.MEDIUM]: {
        iconColor: 'text-yellow-500',
        borderColor: 'border-yellow-500/30',
        bgColor: 'bg-yellow-500/10',
    },
    [AlertSeverity.LOW]: {
        iconColor: 'text-blue-500',
        borderColor: 'border-blue-500/30',
        bgColor: 'bg-blue-500/10',
    },
};


const InvestigationAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await getAlerts();
            setAlerts(data);
            setLoading(false);
        };
        fetchAlerts();
    }, []);

    return (
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-dark-text mb-4">Alertes Critiques</h2>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            ) : (
                <ul className="space-y-4">
                    {alerts.map(alert => {
                        const styles = severityStyles[alert.severity];
                        return (
                            <li key={alert.id} className={`p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} flex items-start gap-4`}>
                                <div className={`flex-shrink-0 mt-1 ${styles.iconColor}`}>
                                    <AlertTriangleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-dark-text">{alert.title}</h3>
                                    <p className="text-sm text-dark-text-secondary mt-1">{alert.description}</p>
                                    <p className="text-xs text-dark-text-secondary/70 mt-2">
                                        {new Date(alert.timestamp).toLocaleString('fr-FR', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default InvestigationAlerts;
