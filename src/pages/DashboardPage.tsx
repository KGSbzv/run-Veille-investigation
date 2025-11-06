import React, { useState, useEffect } from 'react';
// Fix: Use relative paths for imports
import { FolderIcon, EyeIcon } from '../components/ui/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCases } from '../services/mockDataService';
import { Case } from '../types';
import Spinner from '../components/ui/Spinner';
import InvestigationAlerts from '../components/dashboard/InvestigationAlerts';

interface ChartData {
  name: string;
  "Nouveaux Dossiers": number;
}

const processCaseDataForChart = (cases: Case[]): ChartData[] => {
    const countsByMonth = cases.reduce((acc, caseItem) => {
        const date = new Date(caseItem.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        if (!acc[monthKey]) {
            acc[monthKey] = {
                count: 0,
                name: date.toLocaleString('fr-FR', { month: 'short', year: '2-digit' })
            };
        }
        acc[monthKey].count++;
        return acc;
    }, {} as Record<string, { count: number; name: string }>);

    return Object.keys(countsByMonth)
        .sort()
        .map(key => ({
            name: countsByMonth[key].name,
            "Nouveaux Dossiers": countsByMonth[key].count,
        }));
};


const DashboardPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const fetchAndProcessCases = async () => {
        setLoadingChart(true);
        const cases = await getCases();
        const processedData = processCaseDataForChart(cases);
        setChartData(processedData);
        setLoadingChart(false);
    };
    fetchAndProcessCases();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <FolderIcon className="w-8 h-8 text-brand-accent" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-dark-text">Dossiers Actifs</p>
              <p className="text-3xl font-bold text-white">2</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <EyeIcon className="w-8 h-8 text-brand-accent" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-dark-text">Nouveaux Findings</p>
              <p className="text-3xl font-bold text-white">127</p>
              <p className="text-sm text-dark-text-secondary">Dernières 24h</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-dark-card p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-dark-text mb-4">Tendance de Création des Dossiers</h2>
        {loadingChart ? (
            <div className="flex justify-center items-center h-[300px]"><Spinner /></div>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8892b0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0a192f',
                            borderColor: '#334155',
                            color: '#ccd6f6',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="Nouveaux Dossiers" stroke="#6AC4F8" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        )}
      </div>

      <div className="mt-8">
        <InvestigationAlerts />
      </div>
    </div>
  );
};

export default DashboardPage;
