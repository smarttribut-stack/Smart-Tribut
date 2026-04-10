# Smart Tribut - Type Definitions

Este directorio contiene las definiciones de tipos TypeScript compartidas para el sistema Smart Tribut.

## Tipos Definidos

### Enums

#### ErrorCode
Códigos de error estandarizados del sistema, organizados por categoría:
- **1xxx**: Errores de validación (EMPTY_QUERY, QUERY_TOO_LONG, INVALID_SESSION)
- **2xxx**: Errores de red (NETWORK_TIMEOUT, CONNECTION_LOST, DNS_FAILURE)
- **3xxx**: Errores del motor de IA (AI_TIMEOUT, AI_RATE_LIMIT, AI_UNAVAILABLE, AI_INVALID_RESPONSE)
- **5xxx**: Errores del servidor (INTERNAL_ERROR, DATABASE_ERROR, SERVICE_UNAVAILABLE)

#### SessionStatus
Estados posibles de una sesión:
- `ACTIVE`: Sesión activa
- `ENDED`: Sesión finalizada

#### MessageType
Tipos de mensajes en la conversación:
- `QUERY`: Consulta del usuario
- `RESPONSE`: Respuesta del sistema

### Interfaces

#### LegalReference
Representa una referencia legal incluida en una respuesta.

**Campos:**
- `id` (string): Identificador único
- `title` (string): Nombre de la ley o artículo
- `article?` (string): Número de artículo (opcional)
- `url?` (string): Enlace a la fuente oficial (opcional)
- `excerpt?` (string): Fragmento relevante (opcional)
- `jurisdiction` (string): País/región aplicable

#### ErrorDetails
Detalles de un error del sistema.

**Campos:**
- `code` (string): Código de error
- `message` (string): Mensaje para el usuario
- `technicalDetails?` (string): Detalles técnicos para logging (opcional)
- `retryable` (boolean): Si el usuario puede reintentar
- `timestamp` (Date): Momento del error

#### Message
Mensaje individual en una conversación.

**Campos:**
- `id` (string): UUID del mensaje
- `sessionId` (string): UUID de la sesión
- `type` (MessageType): Tipo de mensaje (query/response)
- `content` (string): Texto del mensaje
- `timestamp` (Date): Momento de creación
- `references?` (LegalReference[]): Referencias legales (opcional)
- `metadata?` (object): Metadatos adicionales (opcional)
  - `processingTime?` (number): Tiempo de procesamiento en ms
  - `model?` (string): Modelo de IA utilizado
  - `tokenCount?` (number): Cantidad de tokens

#### Session
Sesión de conversación.

**Campos:**
- `id` (string): UUID de la sesión
- `createdAt` (Date): Fecha de creación
- `lastActivityAt` (Date): Última actividad
- `messages` (Message[]): Historial de mensajes
- `userId?` (string): ID del usuario (opcional)
- `status` (SessionStatus): Estado de la sesión
- `settings` (object): Configuración de la sesión
  - `language` (string): Idioma ('es' por defecto)
  - `maxHistoryLength` (number): Máximo de mensajes en historial

#### ValidationError
Error de validación individual.

**Campos:**
- `field` (string): Campo que falló la validación
- `message` (string): Mensaje de error
- `code` (string): Código de error

#### ValidationResult
Resultado de una validación.

**Campos:**
- `isValid` (boolean): Si la validación fue exitosa
- `errors` (ValidationError[]): Lista de errores encontrados

## Uso

```typescript
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
} from './types';

// Crear un mensaje
const message: Message = {
  id: 'msg-123',
  sessionId: 'session-456',
  type: MessageType.QUERY,
  content: '¿Qué es el IVA?',
  timestamp: new Date(),
};

// Crear un resultado de validación
const result: ValidationResult = {
  isValid: false,
  errors: [
    {
      field: 'query',
      message: 'La consulta no puede estar vacía',
      code: ErrorCode.EMPTY_QUERY,
    },
  ],
};
```

## Requisitos Validados

Estos tipos implementan los requisitos:
- **4.1**: Estructura de datos para historial de conversación
- **4.2**: Soporte para orden cronológico de mensajes
- **5.1**: Estructura de errores del sistema
- **5.2**: Información de errores recuperables

## Testing

Los tipos incluyen tests unitarios en `index.test.ts` que verifican:
- Valores correctos de enums
- Creación de objetos válidos
- Campos opcionales
- Estructura de datos completa
