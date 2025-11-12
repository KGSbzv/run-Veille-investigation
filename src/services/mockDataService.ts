import { Case, CaseStatus, CaseFile, CaseEvent, CaseEventType, UserRole, User, Message, MessageRole, Finding, Alert, AlertSeverity, Watchlist } from '../types';

let mockCases: Case[] = [
  { id: '1', title: 'Opération Corbeau Numérique', description: 'Surveillance des activités de désinformation sur les réseaux sociaux visant le processus électoral.', status: CaseStatus.IN_PROGRESS, category: 'Désinformation', tags: ['réseaux sociaux', 'ingérence'], createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:00:00Z', updatedAt: '2023-10-28T14:30:00Z' },
  { id: '2', title: 'Menaces sur Infrastructure Critique', description: 'Analyse des menaces potentielles contre les systèmes de vote électronique.', status: CaseStatus.OPEN, category: 'Cybersecurité', tags: ['infrastructure', 'élection'], createdBy: 'Analyste Bravo', createdAt: '2023-10-27T11:00:00Z', updatedAt: '2023-10-27T11:00:00Z' },
  { id: '3', title: 'Financements Etrangers', description: 'Enquête sur des flux financiers suspects potentiellement liés au financement de campagnes.', status: CaseStatus.CLOSED, category: 'Finance', tags: ['financement', 'transparence'], createdBy: 'Analyste Charlie', createdAt: '2023-09-15T09:00:00Z', updatedAt: '2023-10-20T17:00:00Z' },
];

let mockFiles: { [caseId: string]: CaseFile[] } = {
  '1': [
    { id: 'f1-1', name: 'rapport_veille_oct.pdf', type: 'application/pdf', size: 120450, uploadedAt: '2023-10-26T10:05:00Z', uploadedBy: 'Analyste Alpha' },
    { id: 'f1-2', name: 'screenshot_propagande.png', type: 'image/png', size: 850320, uploadedAt: '2023-10-27T15:20:00Z', uploadedBy: 'Analyste Alpha' },
  ],
  '2': [
    { id: 'f2-1', name: 'analyse_vulnérabilités.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 450100, uploadedAt: '2023-10-28T09:15:00Z', uploadedBy: 'Analyste Bravo' },
  ],
};

const mockEvents: { [caseId: string]: CaseEvent[] } = {
    '1': [
        { id: 'e1-1', type: CaseEventType.STATUS_CHANGE, payload: { old: CaseStatus.OPEN, new: CaseStatus.IN_PROGRESS }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:00:00Z' },
        { id: 'e1-2', type: CaseEventType.FILE_ADDED, payload: { fileName: 'rapport_veille_oct.pdf' }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:05:00Z' },
        { id: 'e1-3', type: CaseEventType.MESSAGE, payload: { author: 'Analyste Alpha', text: 'Début de l\'analyse des sources.' }, createdBy: 'Analyste Alpha', createdAt: '2023-10-26T10:10:00Z' },
    ]
};

let mockMessages: { [caseId: string]: Message[] } = {
  '1': [
    { id: 'm1-1', role: MessageRole.ASSISTANT, content: "Bonjour, ceci est la conversation pour le dossier 'Opération Corbeau Numérique'. Comment puis-je vous aider ?", timestamp: new Date().toISOString() },
  ],
  '2': [
    { id: 'm2-1', role: MessageRole.ASSISTANT, content: "Début de la conversation pour 'Menaces sur Infrastructure Critique'.", timestamp: new Date().toISOString() },
  ]
};

// Fix: Add mock users data and related functions
let mockUsers: User[] = [
    { id: 'usr-1', email: 'nyh770@gmail.com', role: UserRole.ADMIN, status: 'actif' },
    { id: 'usr-2', email: 'analyste@cacrs.gouv.fr', role: UserRole.ANALYST, status: 'actif' },
    { id: 'usr-3', email: 'viewer@cacrs.gouv.fr', role: UserRole.VIEWER, status: 'bloqué' },
];

export const getUsers = async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUsers), 500));
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | undefined> => {
    return new Promise(resolve => setTimeout(() => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
        }
        resolve(user);
    }, 300));
};

export const updateUserStatus = async (userId: string, newStatus: 'actif' | 'bloqué'): Promise<User | undefined> => {
    return new Promise(resolve => setTimeout(() => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            user.status = newStatus;
        }
        resolve(user);
    }, 300));
};


export const getMessagesForCase = async (caseId: string): Promise<Message[]> => {
    return new Promise(resolve => setTimeout(() => {
        if (!mockMessages[caseId]) {
            mockMessages[caseId] = [{ id: `m${caseId}-1`, role: MessageRole.ASSISTANT, content: "Bonjour, comment puis-je vous assister sur ce nouveau dossier ?", timestamp: new Date().toISOString() }];
        }
        resolve(JSON.parse(JSON.stringify(mockMessages[caseId])));
    }, 300));
};

export const addMessage = async (caseId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    return new Promise(resolve => setTimeout(() => {
        const newMessage: Message = {
            ...message,
            id: `m${caseId}-${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        if(!mockMessages[caseId]) {
            mockMessages[caseId] = [];
        }
        mockMessages[caseId].push(newMessage);
        resolve(newMessage);
    }, 100));
};

const mockKnowledgeChunks: string[] = [
    "Rapport interne 2022: Les campagnes de désinformation russes ciblent souvent les périodes électorales en utilisant des fermes de trolls pour amplifier les récits polarisants.",
    "Directive 03-B: Toute preuve d'ingérence étrangère doit être signalée au niveau supérieur dans les 24 heures.",
    "Analyse post-élection 2022: Le groupe 'Cyber Aigle' a été associé à des tentatives de phishing contre des responsables de campagne."
];

export const getCases = async (): Promise<Case[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockCases), 500));
};

// Fix: Implement and export addCase function
export const addCase = async (caseData: Omit<Case, 'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
    return new Promise(resolve => setTimeout(() => {
        const now = new Date().toISOString();
        const newCase: Case = {
            ...caseData,
            id: `case-${Date.now()}`,
            status: CaseStatus.OPEN,
            createdBy: 'Analyste Alpha', // from auth context
            createdAt: now,
            updatedAt: now,
        };
        mockCases.unshift(newCase);
        resolve(newCase);
    }, 500));
};

export const getCaseById = async (id: string): Promise<Case | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockCases.find(c => c.id === id)), 300));
};

export const getFilesForCase = async (caseId: string): Promise<CaseFile[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockFiles[caseId] || []), 300));
};

export const getEventsForCase = async (caseId: string): Promise<CaseEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockEvents[caseId] || []), 300));
};

export const getRAGContextForQuery = async (_query: string): Promise<string> => {
    // In a real app, this would perform a vector search in pgvector.
    // Here we just return a random chunk.
    return new Promise(resolve => setTimeout(() => resolve(mockKnowledgeChunks.join('\n\n')), 200));
};

export const addFileToCase = async (caseId: string, file: File, base64Content: string): Promise<CaseFile> => {
    const newFile: CaseFile = {
        id: `f${caseId}-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Analyste Alpha', // from auth context
        base64Content: base64Content
    };

    if (!mockFiles[caseId]) {
        mockFiles[caseId] = [];
    }
    mockFiles[caseId].push(newFile);
    return new Promise(resolve => setTimeout(() => resolve(newFile), 500));
};

export const updateFileAnalysis = async (caseId: string, fileId: string, analysis: any): Promise<CaseFile> => {
    const file = mockFiles[caseId]?.find(f => f.id === fileId);
    if (file) {
        file.analysis = analysis;
    }
    return new Promise(resolve => setTimeout(() => resolve(file!), 100));
};

// Fix: Add mock findings data and related functions
let mockFindings: Finding[] = [
    { id: 'fin-1', query: 'Ingérence électorale et bots sociaux', text: 'Un rapport récent de Graphika a identifié une campagne de 300 comptes sur la plateforme X propageant des narratifs anti-démocratiques...', sources: [{ uri: 'https://graphika.com/reports/report-xyz', title: 'Graphika Report on X' }], savedAt: '2023-11-01T10:00:00Z' },
    { id: 'fin-2', query: 'Financement de partis politiques étrangers', text: 'Le Trésor a sanctionné trois entités pour avoir tenté de transférer des fonds illicites vers des campagnes politiques européennes.', sources: [{ uri: 'https://home.treasury.gov/news/press-releases/jy1234', title: 'Treasury Sanctions Entities' }], savedAt: '2023-11-02T14:30:00Z' },
];

export const getFindings = async (): Promise<Finding[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockFindings), 500));
};

export const addFinding = async (findingData: Omit<Finding, 'id' | 'savedAt'>): Promise<Finding> => {
    return new Promise(resolve => setTimeout(() => {
        const newFinding: Finding = {
            ...findingData,
            id: `fin-${Date.now()}`,
            savedAt: new Date().toISOString(),
        };
        mockFindings.unshift(newFinding);
        resolve(newFinding);
    }, 300));
};

export const deleteFinding = async (id: string): Promise<void> => {
    return new Promise(resolve => setTimeout(() => {
        mockFindings = mockFindings.filter(f => f.id !== id);
        resolve();
    }, 200));
};

export const deleteMultipleFindings = async (ids: string[]): Promise<void> => {
    return new Promise(resolve => setTimeout(() => {
        const idSet = new Set(ids);
        mockFindings = mockFindings.filter(f => !idSet.has(f.id));
        resolve();
    }, 400));
};

let mockAlerts: Alert[] = [
  { 
    id: 'alert-1', 
    title: 'Nouvelle Connexion Suspecte', 
    description: 'Une connexion depuis une adresse IP non reconnue (18.156.89.1) a été détectée sur le compte de l\'Analyste Bravo.', 
    severity: AlertSeverity.HIGH, 
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  { 
    id: 'alert-2', 
    title: 'Tentative de Brute-force', 
    description: 'Plusieurs tentatives de connexion échouées sur le dossier "Financements Etrangers" ont été bloquées.', 
    severity: AlertSeverity.MEDIUM, 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'alert-3',
    title: 'Mise à jour du système requise',
    description: 'Une nouvelle version du protocole de chiffrement est disponible. Veuillez planifier la mise à jour.',
    severity: AlertSeverity.LOW,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() // 1 day ago
  }
];

export const getAlerts = async (): Promise<Alert[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAlerts), 400));
};

export const updateCaseStatus = async (caseId: string, status: CaseStatus): Promise<Case | undefined> => {
    return new Promise(resolve => setTimeout(() => {
        const caseToUpdate = mockCases.find(c => c.id === caseId);
        if (caseToUpdate) {
            caseToUpdate.status = status;
            caseToUpdate.updatedAt = new Date().toISOString();
        }
        resolve(caseToUpdate);
    }, 300));
};

export const deleteCase = async (caseId: string): Promise<void> => {
    return new Promise(resolve => setTimeout(() => {
        mockCases = mockCases.filter(c => c.id !== caseId);
        resolve();
    }, 300));
};

let mockWatchlists: Watchlist[] = [
    { id: 'wl-1', name: "Surveillance 'Corbeau Numérique'", query: "Opération Corbeau Numérique activités récentes", refreshIntervalMinutes: 10, lastRun: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
    { id: 'wl-2', name: "Veille 'Infrastructure Critique'", query: "Menaces systèmes de vote électronique 2026", refreshIntervalMinutes: 30, lastRun: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
];

export const getWatchlists = async (): Promise<Watchlist[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockWatchlists), 500));
};

export const addWatchlist = async (watchlistData: Omit<Watchlist, 'id' | 'lastRun'>): Promise<Watchlist> => {
    return new Promise(resolve => setTimeout(() => {
        const newWatchlist: Watchlist = {
            ...watchlistData,
            id: `wl-${Date.now()}`,
            lastRun: new Date().toISOString(),
        };
        mockWatchlists.unshift(newWatchlist);
        resolve(newWatchlist);
    }, 300));
};