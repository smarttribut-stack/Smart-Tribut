import { describe, it, expect } from 'vitest';
import {
  ErrorCode,
  SessionStatus,
  MessageType,
  type LegalReference,
  type ErrorDetails,
  type Message,
  type Session,
  type ValidationError,
  type ValidationResult,
} from './index';

describe('Type Definitions', () => {
  describe('Enums', () => {
    it('should have correct ErrorCode values', () => {
      expect(ErrorCode.EMPTY_QUERY).toBe('ERR_1001');
      expect(ErrorCode.QUERY_TOO_LONG).toBe('ERR_1002');
      expect(ErrorCode.INVALID_SESSION).toBe('ERR_1003');
      expect(ErrorCode.NETWORK_TIMEOUT).toBe('ERR_2001');
      expect(ErrorCode.AI_TIMEOUT).toBe('ERR_3001');
      expect(ErrorCode.INTERNAL_ERROR).toBe('ERR_5001');
    });

    it('should have correct SessionStatus values', () => {
      expect(SessionStatus.ACTIVE).toBe('active');
      expect(SessionStatus.ENDED).toBe('ended');
    });

    it('should have correct MessageType values', () => {
      expect(MessageType.QUERY).toBe('query');
      expect(MessageType.RESPONSE).toBe('response');
    });
  });

  describe('Interfaces', () => {
    it('should create valid LegalReference object', () => {
      const reference: LegalReference = {
        id: 'ref-1',
        title: 'Ley de IVA',
        article: '14',
        url: 'https://example.com/ley-iva',
        excerpt: 'El IVA es...',
        jurisdiction: 'España',
      };

      expect(reference.id).toBe('ref-1');
      expect(reference.title).toBe('Ley de IVA');
      expect(reference.article).toBe('14');
    });

    it('should create valid ErrorDetails object', () => {
      const error: ErrorDetails = {
        code: ErrorCode.AI_TIMEOUT,
        message: 'El procesamiento tardó demasiado',
        technicalDetails: 'Timeout after 30s',
        retryable: true,
        timestamp: new Date(),
      };

      expect(error.code).toBe(ErrorCode.AI_TIMEOUT);
      expect(error.retryable).toBe(true);
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create valid Message object', () => {
      const message: Message = {
        id: 'msg-1',
        sessionId: 'session-1',
        type: MessageType.QUERY,
        content: '¿Qué es el IVA?',
        timestamp: new Date(),
        references: [],
        metadata: {
          processingTime: 1500,
          model: 'gpt-4',
          tokenCount: 50,
        },
      };

      expect(message.id).toBe('msg-1');
      expect(message.type).toBe(MessageType.QUERY);
      expect(message.content).toBe('¿Qué es el IVA?');
      expect(message.metadata?.processingTime).toBe(1500);
    });

    it('should create valid Session object', () => {
      const session: Session = {
        id: 'session-1',
        createdAt: new Date(),
        lastActivityAt: new Date(),
        messages: [],
        status: SessionStatus.ACTIVE,
        settings: {
          language: 'es',
          maxHistoryLength: 50,
        },
      };

      expect(session.id).toBe('session-1');
      expect(session.status).toBe(SessionStatus.ACTIVE);
      expect(session.settings.language).toBe('es');
      expect(session.messages).toEqual([]);
    });

    it('should create valid ValidationError object', () => {
      const validationError: ValidationError = {
        field: 'query',
        message: 'La consulta no puede estar vacía',
        code: ErrorCode.EMPTY_QUERY,
      };

      expect(validationError.field).toBe('query');
      expect(validationError.code).toBe(ErrorCode.EMPTY_QUERY);
    });

    it('should create valid ValidationResult object', () => {
      const result: ValidationResult = {
        isValid: false,
        errors: [
          {
            field: 'query',
            message: 'La consulta es demasiado larga',
            code: ErrorCode.QUERY_TOO_LONG,
          },
        ],
      };

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe(ErrorCode.QUERY_TOO_LONG);
    });

    it('should create ValidationResult with no errors when valid', () => {
      const result: ValidationResult = {
        isValid: true,
        errors: [],
      };

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Optional fields', () => {
    it('should allow LegalReference without optional fields', () => {
      const reference: LegalReference = {
        id: 'ref-2',
        title: 'Ley General Tributaria',
        jurisdiction: 'España',
      };

      expect(reference.article).toBeUndefined();
      expect(reference.url).toBeUndefined();
      expect(reference.excerpt).toBeUndefined();
    });

    it('should allow Message without references and metadata', () => {
      const message: Message = {
        id: 'msg-2',
        sessionId: 'session-2',
        type: MessageType.RESPONSE,
        content: 'El IVA es un impuesto...',
        timestamp: new Date(),
      };

      expect(message.references).toBeUndefined();
      expect(message.metadata).toBeUndefined();
    });

    it('should allow Session without userId', () => {
      const session: Session = {
        id: 'session-3',
        createdAt: new Date(),
        lastActivityAt: new Date(),
        messages: [],
        status: SessionStatus.ACTIVE,
        settings: {
          language: 'es',
          maxHistoryLength: 50,
        },
      };

      expect(session.userId).toBeUndefined();
    });

    it('should allow ErrorDetails without technicalDetails', () => {
      const error: ErrorDetails = {
        code: ErrorCode.NETWORK_TIMEOUT,
        message: 'La conexión tardó demasiado',
        retryable: true,
        timestamp: new Date(),
      };

      expect(error.technicalDetails).toBeUndefined();
    });
  });
});