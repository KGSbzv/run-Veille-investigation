import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCases } from '../services/mockDataService';
import { Case, CaseStatus } from '../types';
import Spinner from '../components/ui/Spinner';

const CaseStatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const color = {
    [CaseStatus.OPEN]: 'bg-blue-500',
    [CaseStatus.IN_PROGRESS]: 'bg-yellow-500',
    [CaseStatus.CLOSED]: 'bg-green-500',
  }[status];
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}>{status}</span>;
};

const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const data = await getCases();
      setCases(data);
      setLoading(false);
    };
    fetchCases();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner size={48}/></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark-text">Dossiers d'enquête</h1>
        <button className="px-4 py-2 bg-brand-lightblue text-white rounded-lg hover:bg-brand-blue">
            Nouveau Dossier
        </button>
      </div>
      <div className="bg-dark-card border border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Titre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Catégorie</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Dernière MàJ</th>
            </tr>
          </thead>
          <tbody className="bg-dark-card divide-y divide-gray-700">
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/cases/${caseItem.id}`} className="text-sm font-medium text-brand-accent hover:underline">{caseItem.title}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CaseStatusBadge status={caseItem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">{caseItem.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">{new Date(caseItem.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasesPage;