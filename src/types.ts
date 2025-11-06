export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: 'actif' | 'bloqué';
}

export enum CaseStatus {
  OPEN = 'Ouvert',
  IN_PROGRESS = 'En cours',
  CLOSED = 'Fermé',
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  isSelected?: boolean;
  isReport?: boolean;
}

export interface CaseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  analysis?: FileAnalysis;
  base64Content?: string; 
}

export interface FileAnalysis {
    summary: string;
    entities: string[];
    risks: string[];
}

export enum CaseEventType {
    MESSAGE = 'message',
    FILE_ADDED = 'file_added',
    STATUS_CHANGE = 'status_change',
    AI_ANALYSIS = 'ai_analysis',
}

export interface CaseEvent {
    id: string;
    type: CaseEventType;
    payload: any;
    createdBy: string;
    createdAt: string;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface Finding {
    id: string;
    query: string;
    text: string;
    sources: GroundingSource[];
    savedAt: string;
}

export enum AlertSeverity {
    HIGH = 'Élevée',
    MEDIUM = 'Moyenne',
    LOW = 'Faible',
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    timestamp: string;
}

export interface Watchlist {
    id: string;
    name: string;
    query: string;
    refreshIntervalMinutes: number;
    lastRun: string;
}