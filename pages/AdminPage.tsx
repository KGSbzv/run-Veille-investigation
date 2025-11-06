
import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Administration</h1>
      <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-dark-text mb-4">Gestion des utilisateurs</h2>
        <p className="text-dark-text-secondary">
          L'interface de gestion des utilisateurs, des rôles et de la base de connaissances (RAG) sera implémentée ici.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
