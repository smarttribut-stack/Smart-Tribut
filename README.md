# Smart Tribut

Aplicación web de asistencia tributaria mediante inteligencia artificial.

## Estructura del Proyecto

```
smart-tribut/
├── frontend/          # Aplicación React con TypeScript
├── backend/           # API REST con Node.js/Express
└── .kiro/specs/       # Especificaciones del proyecto
```

## Requisitos

- Node.js 18+ 
- npm 9+

## Instalación

```bash
# Instalar dependencias de todos los workspaces
npm install
```

## Desarrollo

```bash
# Iniciar frontend y backend simultáneamente
npm run dev

# Iniciar solo frontend (puerto 3000)
npm run dev:frontend

# Iniciar solo backend (puerto 3001)
npm run dev:backend
```

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo property-based tests
npm run test:property

# Ejecutar tests en modo watch
npm run test:watch --workspace=frontend
npm run test:watch --workspace=backend
```

## Linting y Formateo

```bash
# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## Build

```bash
# Construir frontend y backend
npm run build
```

## Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Vitest + React Testing Library
- fast-check (property-based testing)

### Backend
- Node.js
- Express
- TypeScript
- Vitest
- fast-check (property-based testing)

## Licencia

Privado
