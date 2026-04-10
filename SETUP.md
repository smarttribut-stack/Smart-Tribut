# Guía de Configuración - Smart Tribut

## Instalación Inicial

### 1. Clonar el repositorio e instalar dependencias

```bash
# Instalar todas las dependencias (root, frontend y backend)
npm install
```

Este comando instalará las dependencias en los tres niveles:
- Dependencias raíz (concurrently, prettier)
- Dependencias del frontend (React, Vite, fast-check, etc.)
- Dependencias del backend (Express, TypeScript, fast-check, etc.)

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tu API key de IA
# Por ejemplo, para OpenAI:
# AI_API_KEY=sk-...
```

### 3. Verificar la instalación

```bash
# Verificar que TypeScript está configurado correctamente
npx tsc --version

# Verificar estructura del proyecto
npm run lint
```

## Estructura de Directorios Creada

```
smart-tribut/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades
│   │   ├── test/           # Configuración de tests
│   │   ├── App.tsx         # Componente principal
│   │   ├── main.tsx        # Punto de entrada
│   │   └── index.css       # Estilos globales
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .eslintrc.cjs
│
├── backend/
│   ├── src/
│   │   ├── types/          # Tipos TypeScript
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Servicios (AI, Session)
│   │   ├── utils/          # Utilidades
│   │   └── index.ts        # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── .eslintrc.cjs
│
├── .kiro/specs/smart-tribut/  # Especificaciones
├── package.json               # Workspace raíz
├── .prettierrc               # Configuración Prettier
├── .gitignore
├── .env.example
└── README.md
```

## Comandos Disponibles

### Desarrollo

```bash
# Iniciar frontend y backend simultáneamente
npm run dev

# Iniciar solo frontend (http://localhost:3000)
npm run dev:frontend

# Iniciar solo backend (http://localhost:3001)
npm run dev:backend
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo property-based tests
npm run test:property

# Ejecutar tests en modo watch (frontend)
npm run test:watch --workspace=frontend

# Ejecutar tests en modo watch (backend)
npm run test:watch --workspace=backend
```

### Linting y Formateo

```bash
# Ejecutar ESLint en todo el proyecto
npm run lint

# Formatear código con Prettier
npm run format
```

### Build

```bash
# Construir frontend y backend para producción
npm run build
```

## Próximos Pasos

Después de completar la configuración inicial, las siguientes tareas del spec son:

1. **Tarea 2**: Implementar modelos de datos y tipos TypeScript
2. **Tarea 3**: Implementar sistema de validación de entrada
3. **Tarea 4**: Implementar componentes del frontend

Consulta `.kiro/specs/smart-tribut/tasks.md` para ver el plan completo de implementación.

## Tecnologías Configuradas

### Frontend
- ✅ React 18 con TypeScript
- ✅ Vite (build tool y dev server)
- ✅ Vitest + React Testing Library
- ✅ fast-check para property-based testing
- ✅ ESLint + Prettier

### Backend
- ✅ Node.js con Express
- ✅ TypeScript
- ✅ Vitest para testing
- ✅ fast-check para property-based testing
- ✅ ESLint + Prettier

### Herramientas de Desarrollo
- ✅ TypeScript 5.3+ en frontend y backend
- ✅ ESLint configurado con reglas TypeScript
- ✅ Prettier para formateo consistente
- ✅ Workspaces de npm para monorepo
- ✅ Configuración de testing con Vitest

## Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

### Error de TypeScript
```bash
# Limpiar cache de TypeScript
rm -rf frontend/dist backend/dist
npm run build
```

### Puerto en uso
```bash
# Cambiar puerto en .env
PORT=3002  # para backend

# O en frontend/vite.config.ts cambiar server.port
```
