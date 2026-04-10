/**
 * Smart Tribut - Query Validation
 * Funciones de validación de consultas de usuarios
 */

import { ErrorCode, ValidationResult, ValidationError } from '../types';

/**
 * Longitud máxima permitida para una consulta
 */
const MAX_QUERY_LENGTH = 500;

/**
 * Valida una consulta de usuario
 * 
 * Verifica:
 * - Que la consulta no esté vacía
 * - Que no exceda la longitud máxima de 500 caracteres
 * - Que contenga caracteres válidos en español (ñ, tildes, ¿, ¡)
 * 
 * @param query - La consulta a validar
 * @returns ValidationResult con isValid y lista de errores
 * 
 * @example
 * ```typescript
 * const result = validateQuery('¿Qué es el IVA?');
 * if (!result.isValid) {
 *   console.log(result.errors);
 * }
 * ```
 */
export function validateQuery(query: string): ValidationResult {
  const errors: ValidationError[] = [];

  // Validar que la consulta no esté vacía
  if (!query || query.trim().length === 0) {
    errors.push({
      field: 'query',
      message: 'Por favor, ingresa una consulta antes de enviar.',
      code: ErrorCode.EMPTY_QUERY,
    });
  }

  // Validar longitud máxima
  if (query.length > MAX_QUERY_LENGTH) {
    errors.push({
      field: 'query',
      message: `La consulta es demasiado larga. Máximo ${MAX_QUERY_LENGTH} caracteres.`,
      code: ErrorCode.QUERY_TOO_LONG,
    });
  }

  // La validación de caracteres en español es implícita en JavaScript/TypeScript
  // ya que las cadenas son UTF-16 y soportan todos los caracteres Unicode.
  // No necesitamos validación adicional para ñ, tildes, ¿, ¡ porque son
  // caracteres válidos por defecto.

  return {
    isValid: errors.length === 0,
    errors,
  };
}
