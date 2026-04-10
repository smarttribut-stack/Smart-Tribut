# Guía de Despliegue - Smart Tribut
## Hacer tu aplicación accesible desde cualquier dispositivo

---

## 🎯 Objetivo
Desplegar Smart Tribut en internet para que cualquier persona pueda acceder desde su móvil, tablet o computadora usando un link.

---

## 🚀 Opción 1: Vercel + Render (RECOMENDADO - GRATIS)

### Frontend en Vercel (Gratis)

**Paso 1: Preparar el proyecto**

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Instala Vercel CLI:
```bash
npm install -g vercel
```

**Paso 2: Configurar el frontend**

Crea un archivo `vercel.json` en la carpeta `frontend`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

**Paso 3: Desplegar**

```bash
cd frontend
vercel login
vercel --prod
```

Vercel te dará un link como: `https://smart-tribut.vercel.app`

---

### Backend en Render (Gratis)

**Paso 1: Preparar el backend**

1. Crea una cuenta en [render.com](https://render.com)
2. Asegúrate de tener un archivo `package.json` con estos scripts:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  }
}
```

**Paso 2: Crear archivo de configuración**

Crea `render.yaml` en la raíz del proyecto:

```yaml
services:
  - type: web
    name: smart-tribut-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: PORT
        value: 3001
      - key: NODE_ENV
        value: production
```

**Paso 3: Desplegar**

1. Sube tu código a GitHub
2. En Render, conecta tu repositorio
3. Render detectará automáticamente la configuración
4. Te dará un link como: `https://smart-tribut-backend.onrender.com`

---

### Conectar Frontend con Backend

Actualiza el frontend para usar la URL del backend en producción:

Crea `frontend/.env.production`:
```env
VITE_API_URL=https://smart-tribut-backend.onrender.com
```

Crea `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:3001
```

Actualiza el código para usar estas variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## 🚀 Opción 2: Netlify + Railway (GRATIS)

### Frontend en Netlify

**Paso 1: Preparar**
1. Crea cuenta en [netlify.com](https://netlify.com)
2. Instala Netlify CLI:
```bash
npm install -g netlify-cli
```

**Paso 2: Configurar**

Crea `netlify.toml` en la carpeta `frontend`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Paso 3: Desplegar**
```bash
cd frontend
netlify login
netlify deploy --prod
```

Link resultante: `https://smart-tribut.netlify.app`

---

### Backend en Railway

**Paso 1: Preparar**
1. Crea cuenta en [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub

**Paso 2: Configurar**

Railway detecta automáticamente Node.js. Solo asegúrate de tener:

`backend/package.json`:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc"
  }
}
```

**Paso 3: Variables de entorno**

En Railway dashboard, agrega:
- `PORT`: 3001
- `NODE_ENV`: production

Link resultante: `https://smart-tribut-backend.up.railway.app`

---

## 🚀 Opción 3: Todo en un solo lugar - Heroku (GRATIS con límites)

**Nota**: Heroku ya no tiene plan gratuito ilimitado, pero puedes usar créditos estudiantiles.

### Desplegar ambos servicios

**Paso 1: Instalar Heroku CLI**
```bash
npm install -g heroku
```

**Paso 2: Login**
```bash
heroku login
```

**Paso 3: Crear apps**
```bash
# Backend
cd backend
heroku create smart-tribut-api
git push heroku main

# Frontend
cd ../frontend
heroku create smart-tribut-web
heroku buildpacks:set heroku/nodejs
git push heroku main
```

---

## 🌐 Opción 4: Compartir en tu red local (Para demos rápidas)

### Usando ngrok (Temporal - Gratis)

**Paso 1: Instalar ngrok**
```bash
npm install -g ngrok
```

**Paso 2: Iniciar tus servidores**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Paso 3: Crear túneles públicos**
```bash
# Terminal 3 - Backend público
ngrok http 3001

# Terminal 4 - Frontend público
ngrok http 5173
```

Ngrok te dará URLs como:
- Backend: `https://abc123.ngrok.io`
- Frontend: `https://xyz789.ngrok.io`

**Ventajas**: Instantáneo, no requiere configuración
**Desventajas**: El link cambia cada vez que reinicias

---

## 📱 Hacer la App Responsive (Accesible desde móviles)

Actualiza `frontend/src/index.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .app {
    padding: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  p {
    font-size: 0.9rem;
  }
}

/* Responsive para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .app {
    padding: 1.5rem;
  }
}
```

Actualiza `frontend/index.html` para asegurar viewport correcto:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="description" content="Smart Tribut - Asistente Tributario con IA" />
    <meta name="theme-color" content="#2563eb" />
    <title>Smart Tribut - Asistencia Tributaria con IA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🔒 Configuración de Seguridad

Actualiza `backend/src/index.ts` para producción:

```typescript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware con CORS configurado
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
```

---

## ✅ Checklist de Despliegue

### Antes de desplegar:

- [ ] Código funciona localmente sin errores
- [ ] Tests pasan correctamente
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] Responsive design implementado
- [ ] Código subido a GitHub

### Durante el despliegue:

- [ ] Frontend desplegado y accesible
- [ ] Backend desplegado y accesible
- [ ] Frontend conectado al backend correcto
- [ ] Health check del backend funciona
- [ ] Probado en móvil, tablet y desktop

### Después del despliegue:

- [ ] Compartir link con compañeros
- [ ] Probar desde diferentes dispositivos
- [ ] Monitorear errores
- [ ] Documentar el link en README.md

---

## 🎯 Recomendación Final

**Para tu presentación escolar, te recomiendo:**

1. **Vercel (Frontend)** - Más rápido y fácil
2. **Render (Backend)** - Plan gratuito generoso
3. **ngrok (Backup)** - Por si algo falla el día de la presentación

**Tiempo estimado de despliegue**: 30-45 minutos

---

## 📝 Actualizar README con el Link

Agrega esto a tu `README.md`:

```markdown
## 🌐 Demo en Vivo

- **Frontend**: https://smart-tribut.vercel.app
- **Backend API**: https://smart-tribut-backend.onrender.com
- **Health Check**: https://smart-tribut-backend.onrender.com/health

### Acceso desde cualquier dispositivo:
- 📱 Móvil: Escanea el QR o visita el link
- 💻 Desktop: Abre el link en tu navegador
- 📲 Tablet: Compatible con todas las resoluciones
```

---

## 🆘 Solución de Problemas

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo
- Revisa la variable `VITE_API_URL`
- Chequea CORS en el backend

### Error: "Build failed"
- Ejecuta `npm install` en ambas carpetas
- Verifica que `tsconfig.json` esté correcto
- Revisa los logs de error

### La página se ve mal en móvil
- Verifica el meta viewport en `index.html`
- Revisa los media queries en CSS
- Prueba en Chrome DevTools (modo responsive)

---

¿Necesitas ayuda con algún paso específico del despliegue? 🚀
