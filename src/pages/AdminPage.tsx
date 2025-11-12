import React, { useState, lazy, Suspense } from 'react';
import { getUsers, updateUserRole, updateUserStatus } from '../services/mockDataService';
import { User, UserRole } from '../types';
import Spinner from '../components/ui/Spinner';
import { BanIcon, CheckCircle2Icon } from '../components/ui/Icons';

// Lazy load AdminServicesSettings
const AdminServicesSettings = lazy(() => import('./AdminServicesSettings'));

// --- Composant pour la gestion des utilisateurs ---
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    await updateUserRole(userId, newRole);
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setUpdatingId(null);
  };

  const handleStatusToggle = async (user: User) => {
    setUpdatingId(user.id);
    const newStatus = user.status === 'actif' ? 'bloqué' : 'actif';
    await updateUserStatus(user.id, newStatus);
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    setUpdatingId(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size={48}/></div>;
  }

  return (
    <div className="bg-dark-card border border-gray-700 rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Utilisateur</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Rôle</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-dark-card divide-y divide-gray-700">
          {users.map((user) => (
            <tr key={user.id} className={`transition-opacity ${updatingId === user.id ? 'opacity-50' : 'opacity-100'}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <select
                   value={user.role}
                   onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                   disabled={user.role === UserRole.ADMIN || updatingId === user.id}
                   className="bg-gray-700 border border-gray-600 text-dark-text rounded-md px-2 py-1 focus:ring-brand-accent focus:border-brand-accent disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {Object.values(UserRole).map(role => (
                     <option key={role} value={role}>{role}</option>
                   ))}
                 </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                 {user.status === 'actif' ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">Actif</span>
                 ) : (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">Bloqué</span>
                 )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <button
                   onClick={() => handleStatusToggle(user)}
                   disabled={user.role === UserRole.ADMIN || updatingId === user.id}
                   className={`flex items-center px-3 py-1 text-xs rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors ${user.status === 'actif' ? 'bg-red-800 hover:bg-red-700 text-red-100' : 'bg-green-800 hover:bg-green-700 text-green-100'}`}
                 >
                   {updatingId === user.id ? <Spinner size={16} /> : (
                      user.status === 'actif' ? (
                         <><BanIcon className="w-4 h-4 mr-1.5" /> Bloquer</>
                      ) : (
                         <><CheckCircle2Icon className="w-4 h-4 mr-1.5" /> Débloquer</>
                      )
                   )}
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Composants pour la documentation système ---

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-dark-card border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-dark-text mb-4">{title}</h2>
        {children}
    </div>
);

const SystemDocsTable: React.FC<{
    services: { name: string; func: string; details: string; admin: string; }[],
    detailsHeader: string;
}> = ({ services, detailsHeader }) => {
    const renderCellContent = (content: string) => (
        <ul className="list-none p-0 m-0 space-y-1">
            {content.split('<br>').map((item, index) => (
                <li key={index}>{item.replace(/•\s*/, '').trim()}</li>
            ))}
        </ul>
    );

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-700 text-sm border border-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="w-1/4 px-4 py-2 text-left font-medium text-dark-text-secondary uppercase tracking-wider">Service</th>
                        <th className="w-1/4 px-4 py-2 text-left font-medium text-dark-text-secondary uppercase tracking-wider">Fonction</th>
                        <th className="w-1/4 px-4 py-2 text-left font-medium text-dark-text-secondary uppercase tracking-wider">{detailsHeader}</th>
                        <th className="w-1/4 px-4 py-2 text-left font-medium text-dark-text-secondary uppercase tracking-wider">Gestion Administrative</th>
                    </tr>
                </thead>
                <tbody className="bg-dark-card divide-y divide-gray-700">
                    {services.map((service, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 align-top whitespace-nowrap text-dark-text">{service.name}</td>
                            <td className="px-4 py-3 align-top text-dark-text-secondary">{service.func}</td>
                            <td className="px-4 py-3 align-top text-dark-text-secondary">{service.details}</td>
                            <td className="px-4 py-3 align-top text-dark-text-secondary">{renderCellContent(service.admin)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const SystemArchitectureContent: React.FC = () => {
    const botServices = [
        { name: 'Gemini for Google Cloud API', func: 'LLM générative', details: 'Compréhension contextuelle, génération avancée', admin: '• Model selection<br>• Temperature settings<br>• Token limits<br>• Safety thresholds<br>• Prompt management<br>• Cost tracking' },
        { name: 'Vertex AI API', func: 'Orchestration ML', details: 'Training, deployment, monitoring modèles', admin: '• Model registry browser<br>• Training job manager<br>• Endpoint deployment<br>• A/B test setup<br>• Performance dashboard<br>• Feature store' },
        { name: 'Generative Language API', func: 'Génération texte', details: 'Completion, chat, embeddings', admin: '• API key management<br>• Rate limiting<br>• Model selection<br>• Context window<br>• Response filtering' },
        { name: 'Cloud Natural Language API', func: 'NLU', details: 'Intent, entities, sentiment, syntax', admin: '• Entity extraction config<br>• Sentiment thresholds<br>• Language detection<br>• Custom models<br>• Batch processing' },
        { name: 'Firebase Cloud Messaging API', func: 'Notifications push', details: 'Cross-platform, topics, segments', admin: '• Campaign manager<br>• Topic management<br>• Segment builder<br>• Delivery reports<br>• A/B testing' },
        { name: 'Firebase In-App Messaging API', func: 'Messages in-app', details: 'Contextuel, comportemental, A/B testing', admin: '• Message composer<br>• Trigger rules<br>• Audience targeting<br>• Campaign analytics<br>• Template library' },
        { name: 'Firebase Remote Config API', func: 'Configuration dynamique', details: 'Personnalisation, feature flags', admin: '• Parameter editor<br>• Condition builder<br>• User segments<br>• Rollout control<br>• History tracking' },
        { name: 'Realtime API', func: 'Communication temps réel', details: 'WebSockets, présence, synchronisation', admin: '• Connection monitoring<br>• Presence tracking<br>• Channel management<br>• Rate limiting<br>• Debug tools' },
    ];
    
    const orchestrationServices = [
        { name: 'Vertex AI Workbench', func: 'Développement ML', details: 'Notebooks, expérimentation, collaboration', admin: '• Notebook management<br>• Resource allocation<br>• Sharing controls<br>• Version control<br>• Cost tracking' },
        { name: 'Vertex AI Pipelines', func: 'MLOps', details: 'Orchestration workflows, CI/CD ML', admin: '• Pipeline designer<br>• Workflow templates<br>• Execution monitoring<br>• Artifact tracking<br>• Schedule config' },
        { name: 'Vertex AI Model Registry', func: 'Gestion modèles', details: 'Versioning, metadata, lineage', admin: '• Model catalog<br>• Version management<br>• Metadata editor<br>• Lineage viewer<br>• Access control' },
        { name: 'Vertex AI Endpoints', func: 'Serving modèles', details: 'Auto-scaling, A/B testing, monitoring', admin: '• Endpoint creation<br>• Traffic splitting<br>• Auto-scaling rules<br>• Monitoring setup<br>• Cost optimization' },
        { name: 'Vertex AI Experiments', func: 'Tracking expériences', details: 'Hyperparameters, metrics, comparaisons', admin: '• Experiment tracking<br>• Parameter comparison<br>• Metrics visualization<br>• Best model selection<br>• Report generation' },
        { name: 'Vertex AI Feature Store', func: 'Features ML', details: 'Centralisation, serving, monitoring', admin: '• Feature management<br>• Ingestion pipelines<br>• Serving config<br>• Monitoring setup<br>• Data quality checks' },
        { name: 'Vertex AI Matching Engine', func: 'Similarité vectorielle', details: 'Recherche sémantique, recommendations', admin: '• Index management<br>• Query optimization<br>• Update strategies<br>• Performance tuning<br>• Cost control' },
        { name: 'Vertex AI Explainable AI', func: 'Interprétabilité', details: 'Feature attributions, model explanations', admin: '• Explanation config<br>• Attribution methods<br>• Visualization tools<br>• Report templates<br>• Threshold settings' },
    ];
    
    const iamServices = [
        { name: 'Identity and Access Management API', func: 'Gestion permissions', details: 'Rôles granulaires, policies, conditions', admin: '• Role editor GUI<br>• Policy simulator<br>• Access analyzer<br>• Audit reports<br>• Least privilege recommendations' },
        { name: 'Identity Toolkit API', func: 'Authentification', details: 'MFA, SSO, passwordless, biométrie', admin: '• Auth provider config<br>• MFA enforcement<br>• Session management<br>• User lockout policies<br>• Auth logs' },
        { name: 'Identity Platform', func: 'Gestion utilisateurs', details: 'LDAP, SAML, OAuth, social login', admin: '• User import/export<br>• Provider configuration<br>• Custom claims<br>• Email templates<br>• Tenant management' },
        { name: 'Admin SDK API', func: 'Administration users', details: 'CRUD utilisateurs, groupes, domaines', admin: '• Bulk operations<br>• Group management<br>• Domain settings<br>• License assignment<br>• Activity reports' },
        { name: 'Privileged Access Manager API', func: 'Accès privilégiés', details: 'Just-in-time access, approval workflows', admin: '• Entitlement config<br>• Approval chains<br>• Access duration<br>• Justification requirements<br>• Audit trail' },
        { name: 'Organization Policy API', func: 'Gouvernance', details: 'Contraintes org, enforcement central', admin: '• Policy constraints<br>• Inheritance rules<br>• Exceptions management<br>• Compliance monitoring' },
        { name: 'Cloud Resource Manager API', func: 'Hiérarchie ressources', details: 'Projets, folders, organisation', admin: '• Resource hierarchy<br>• Project creation<br>• Folder structure<br>• Labels management<br>• Move operations' },
        { name: 'IAM Service Account Credentials API', func: 'Gestion comptes service', details: 'Rotation clés, impersonation', admin: '• Key rotation scheduler<br>• Impersonation config<br>• Usage tracking<br>• Unused account detection' },
    ];

    const backupServices = [
        { name: 'Cloud Storage API', func: 'Stockage objets', details: 'Multi-régional, versioning, lifecycle policies', admin: '• Bucket creation wizard<br>• Lifecycle rules editor<br>• Versioning control<br>• Replication config<br>• Cost analysis' },
        { name: 'Storage Transfer Service', func: 'Migration données', details: 'Transferts programmés, validation intégrité', admin: '• Transfer job scheduler<br>• Source/dest config<br>• Bandwidth throttling<br>• Progress monitoring<br>• Error handling' },
        { name: 'Cloud SQL Admin API', func: 'Backup SQL', details: 'Automatique, point-in-time recovery', admin: '• Backup scheduling<br>• PITR configuration<br>• Restore operations<br>• Backup testing<br>• Storage management' },
        { name: 'Backup for GKE API', func: 'Backup Kubernetes', details: 'Snapshots volumes, configs, secrets', admin: '• Backup plans<br>• Restore strategies<br>• Volume snapshots<br>• Config backup<br>• Testing scheduler' },
        { name: 'Database Migration API', func: 'Migration bases', details: 'Zero-downtime, validation continue', admin: '• Migration jobs<br>• Source/target config<br>• Validation rules<br>• Cutover planning<br>• Rollback procedures' },
        { name: 'Datastream API', func: 'Réplication temps réel', details: 'CDC, synchronisation multi-sources', admin: '• Stream creation<br>• Source config<br>• Destination setup<br>• Lag monitoring<br>• Error recovery' },
        { name: 'Storage Insights API', func: 'Analyse stockage', details: 'Coûts, patterns accès, optimisations', admin: '• Cost breakdown<br>• Access patterns<br>• Optimization tips<br>• Forecast models<br>• Anomaly detection' },
    ];

    const reportingServices = [
        { name: 'BigQuery API', func: 'Requêtes analytiques', details: 'SQL, nested data, partitioning, clustering', admin: '• Query builder UI<br>• Table designer<br>• Partition config<br>• Clustering setup<br>• Performance tuning' },
        { name: 'BigQuery Data Transfer API', func: 'Import données', details: 'Sources multiples, scheduling, monitoring', admin: '• Transfer config<br>• Schedule setup<br>• Source connectors<br>• Error handling<br>• Run history' },
        { name: 'BigQuery Connection API', func: 'Connexions externes', details: 'Cloud SQL, Spanner, APIs externes', admin: '• Connection manager<br>• Credential setup<br>• Test connections<br>• Usage monitoring' },
        { name: 'Google Sheets API', func: 'Export tableur', details: 'Création, modification, formatage programmatique', admin: '• Template manager<br>• Batch operations<br>• Format presets<br>• Sharing config<br>• Version control' },
        { name: 'Google Tasks API', func: 'Gestion tâches', details: 'Création, assignation, suivi completion', admin: '• Task lists management<br>• Assignment rules<br>• Due date tracking<br>• Completion reports' },
        { name: 'Cloud Scheduler API', func: 'Planification', details: 'Cron jobs, retry policies, timezones', admin: '• Job scheduler UI<br>• Cron expression builder<br>• Retry configuration<br>• Timezone settings<br>• Execution history' },
        { name: 'Cloud Tasks API', func: 'Files d\'attente', details: 'Asynchrone, rate limiting, retry', admin: '• Queue management<br>• Rate limit config<br>• Retry policies<br>• Dead letter queues<br>• Task monitoring' },
        { name: 'Cloud Pub/Sub API', func: 'Messaging', details: 'Pub/sub, dead letter, ordering', admin: '• Topic management<br>• Subscription config<br>• Message retention<br>• Dead letter setup<br>• Flow control' },
    ];
    
    return (
        <div>
            <InfoSection title="Bot Conversationnel Intelligent (Architecture IA)">
                <h3 className="text-xl font-semibold text-dark-text mb-3">Services Google Utilisés</h3>
                <SystemDocsTable services={botServices} detailsHeader="Capacités" />
            </InfoSection>

            <InfoSection title="Orchestration Intelligence Artificielle (MLOps)">
                <h3 className="text-xl font-semibold text-dark-text mb-3">Services Google Utilisés</h3>
                <SystemDocsTable services={orchestrationServices} detailsHeader="Application" />
            </InfoSection>

            <InfoSection title="Gestion des Identités et Accès (IAM)">
                <h3 className="text-xl font-semibold text-dark-text mb-3">Services Google Utilisés</h3>
                <SystemDocsTable services={iamServices} detailsHeader="Sécurité" />
            </InfoSection>

            <InfoSection title="Système de Sauvegarde et Archivage">
                <h3 className="text-xl font-semibold text-dark-text mb-3">Services Google Utilisés</h3>
                <SystemDocsTable services={backupServices} detailsHeader="Configuration" />
            </InfoSection>
            
            <InfoSection title="Module de Reporting et Export">
                <h3 className="text-xl font-semibold text-dark-text mb-3">Services Google Utilisés</h3>
                <SystemDocsTable services={reportingServices} detailsHeader="Capacités" />
            </InfoSection>
        </div>
    );
};

// --- Composant principal de la page Admin ---

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tabName
                ? 'border-b-2 border-brand-accent text-dark-text'
                : 'border-b-2 border-transparent text-dark-text-secondary hover:text-dark-text'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-text mb-6">Administration</h1>
      
      <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-4">
              <TabButton tabName="users" label="Gestion des Utilisateurs" />
              <TabButton tabName="services" label="Services & IA / Secrets" />
              <TabButton tabName="architecture" label="Architecture Système" />
          </nav>
      </div>

      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'services' && (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Spinner size={48}/></div>}>
            <AdminServicesSettings />
          </Suspense>
        )}
        {activeTab === 'architecture' && <SystemArchitectureContent />}
      </div>
    </div>
  );
};

export default AdminPage;