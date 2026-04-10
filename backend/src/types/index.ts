/**
 * Smart Tribut - Type Definitions
 * Interfaces y tipos base para el sistema de asistencia tributaria
 */

/**
 * Códigos de error del sistema
 */
export enum ErrorCode {
  // Validation (1xxx)
  EMPTY_QUERY = 'ERR_1001',
  QUERY_TOO_LONG = 'ERR_1002',
  INVALID_SESSION = 'ERR_1003',
  
  // Network (2xxx)
  NETWORK_TIMEOUT = 'ERR_2001',
  CONNECTION_LOST = 'ERR_2002',
  DNS_FAILURE = 'ERR_2003',
  
  // AI Engine (3xxx)
  AI_TIMEOUT = 'ERR_3001',
  AI_RATE_LIMIT = 'ERR_3002',
  AI_UNAVAILABLE = 'ERR_3003',
  AI_INVALID_RESPONSE = 'ERR_3004',
  
  // Server (5xxx)
  INTERNAL_ERROR = 'ERR_5001',
  DATABASE_ERROR = 'ERR_5002',
  SERVICE_UNAVAILABLE = 'ERR_5003',
}

/**
 * Estados de sesión
 */
export enum SessionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
}

/**
 * Tipo de mensaje en la conversación
 */
export enum MessageType {
  QUERY = 'query',
  RESPONSE = 'response',
}

/**
 * Referencia legal incluida en una respuesta
 */
export interface LegalReference {
  id: string;
  title: string;
  article?: string;
  url?: string;
  excerpt?: string;
  jurisdiction: string;
}

/**
 * Detalles de un error del sistema
 */
export interface ErrorDetails {
  code: string;
  message: string;
  technicalDetails?: string;
  retryable: boolean;
  timestamp: Date;
}

/**
 * Mensaje individual en una conversación
 */
export interface Message {
  id: string;
  sessionId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  references?: LegalReference[];
  metadata?: {
    processingTime?: number;
    model?: string;
    tokenCount?: number;
  };
}

/**
 * Sesión de conversación
 */
export interface Session {
  id: string;
  createdAt: Date;
  lastActivityAt: Date;
  messages: Message[];
  userId?: string;
  status: SessionStatus;
  settings: {
    language: string;
    maxHistoryLength: number;
  };
}

/**
 * Error de validación individual
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}