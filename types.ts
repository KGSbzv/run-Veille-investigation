
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
