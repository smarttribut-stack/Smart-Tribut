/**
 * Smart Tribut - Query Validation Tests
 * Tests unitarios para la función de validación de consultas
 */

import { describe, it, expect } from 'vitest';
import { validateQuery } from './validation';
import { ErrorCode } from '../types';

describe('validateQuery', () => {
  describe('Validación de consulta vacía', () => {
    it('debe rechazar consulta vacía', () => {
      const result = validateQuery('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe(ErrorCode.EMPTY_QUERY);
      expect(result.errors[0].field).toBe('query');
      expect(result.errors[0].message).toContain('ingresa una consulta');
    });

    it('debe rechazar consulta con solo espacios en blanco', () => {
      const result = validateQuery('   ');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe(ErrorCode.EMPTY_QUERY);
    });

    it('debe rechazar consulta con solo tabs y saltos de línea', () => {
      const result = validateQuery('\t\n\r  ');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ErrorCode.EMPTY_QUERY);
    });
  });

  describe('Validación de longitud', () => {
    it('debe aceptar consulta de exactamente 500 caracteres', () => {
      const query = 'a'.repeat(500);
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe rechazar consulta de 501 caracteres', () => {
      const query = 'a'.repeat(501);
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe(ErrorCode.QUERY_TOO_LONG);
      expect(result.errors[0].field).toBe('query');
      expect(result.errors[0].message).toContain('500 caracteres');
    });

    it('debe rechazar consulta muy larga (1000 caracteres)', () => {
      const query = 'a'.repeat(1000);
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ErrorCode.QUERY_TOO_LONG);
    });

    it('debe aceptar consulta corta (10 caracteres)', () => {
      const query = '¿Qué es?';
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta de longitud media (250 caracteres)', () => {
      const query = 'a'.repeat(250);
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Soporte de caracteres en español', () => {
    it('debe aceptar consulta con letra ñ', () => {
      const result = validateQuery('¿Qué es el año fiscal?');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con tildes (á, é, í, ó, ú)', () => {
      const result = validateQuery('¿Cuál es la información básica sobre impuestos?');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con signos de interrogación españoles (¿?)', () => {
      const result = validateQuery('¿Qué es el IVA?');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con signos de exclamación españoles (¡!)', () => {
      const result = validateQuery('¡Necesito ayuda con mis impuestos!');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con diéresis (ü)', () => {
      const result = validateQuery('¿Qué es la antigüedad en el sistema tributario?');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con múltiples caracteres especiales españoles', () => {
      const result = validateQuery('¿Cuál es la información sobre el año fiscal, señor Muñoz?');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta compleja en español', () => {
      const query = '¿Cómo puedo calcular el IVA de mi facturación anual? ' +
                    '¡Necesito información específica sobre deducciones!';
      const result = validateQuery(query);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Casos edge combinados', () => {
    it('debe rechazar consulta vacía aunque tenga espacios', () => {
      const result = validateQuery('     ');
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ErrorCode.EMPTY_QUERY);
    });

    it('debe aceptar consulta de 1 carácter', () => {
      const result = validateQuery('a');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe aceptar consulta con espacios al inicio y final', () => {
      const result = validateQuery('  ¿Qué es el IVA?  ');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe contar correctamente caracteres especiales en la longitud', () => {
      // Crear una consulta de exactamente 500 caracteres con caracteres especiales
      const base = '¿Ñ?'.repeat(166); // 498 caracteres (3 * 166)
      const query = base + 'ab'; // 500 caracteres exactos
      const result = validateQuery(query);
      
      expect(query.length).toBe(500);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe rechazar consulta de 501 caracteres con caracteres especiales', () => {
      const base = '¿Ñ?'.repeat(167); // 501 caracteres (3 * 167)
      const result = validateQuery(base);
      
      expect(base.length).toBe(501);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ErrorCode.QUERY_TOO_LONG);
    });
  });

  describe('Validación de resultado', () => {
    it('debe retornar ValidationResult con estructura correcta cuando es válido', () => {
      const result = validateQuery('¿Qué es el IVA?');
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result.isValid).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debe retornar ValidationResult con estructura correcta cuando es inválido', () => {
      const result = validateQuery('');
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result.isValid).toBe(false);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Verificar estructura de cada error
      result.errors.forEach(error => {
        expect(error).toHaveProperty('field');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('code');
        expect(typeof error.field).toBe('string');
        expect(typeof error.message).toBe('string');
        expect(typeof error.code).toBe('string');
      });
    });
  });
});
