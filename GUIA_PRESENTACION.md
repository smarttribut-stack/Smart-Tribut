# Guía para Presentación Escolar - Smart Tribut

## 📋 Estructura de la Presentación (15-20 minutos)

### 1. INTRODUCCIÓN (2-3 min)
**Diapositiva 1: Portada**
- Título: Smart Tribut - Asistente Tributario con IA
- Nombres del equipo
- Fecha

**Diapositiva 2: Problema**
- ¿Qué problema resuelve?
  - Consultas tributarias complejas
  - Información dispersa y difícil de entender
  - Necesidad de respuestas rápidas y precisas

**Diapositiva 3: Solución**
- Asistente virtual con IA
- Respuestas basadas en legislación española
- Interfaz simple y accesible

---

### 2. TECNOLOGÍAS UTILIZADAS (3-4 min)

**Diapositiva 4: Stack Tecnológico**
```
Frontend:
├── React 18 - Interfaz de usuario
├── TypeScript - Tipado estático
├── Vite - Herramienta de desarrollo
└── Vitest - Testing

Backend:
├── Node.js - Servidor
├── Express - Framework web
├── TypeScript - Tipado estático
└── CORS - Comunicación segura
```

**Diapositiva 5: ¿Por qué estas tecnologías?**
- React: Popular, componentes reutilizables
- TypeScript: Previene errores, código más seguro
- Express: Ligero, flexible, ampliamente usado
- Vite: Desarrollo rápido, builds optimizados

---

### 3. ARQUITECTURA DEL SISTEMA (4-5 min)

**Diapositiva 6: Diagrama de Arquitectura**
```
┌─────────────┐         ┌─────────────┐
│   Usuario   │         │     IA      │
│  (Navegador)│         │   (OpenAI)  │
└──────┬──────┘         └──────▲──────┘
       │                       │
       │ HTTP                  │ API
       ▼                       │
┌─────────────┐         ┌──────┴──────┐
│  Frontend   │◄───────►│   Backend   │
│   React     │  REST   │   Express   │
│ Port: 5173  │   API   │  Port: 3001 │
└─────────────┘         └─────────────┘
```

**Diapositiva 7: Flujo de Datos**
1. Usuario hace una pregunta
2. Frontend envía consulta al Backend
3. Backend procesa y consulta IA
4. IA genera respuesta con referencias legales
5. Backend devuelve respuesta
6. Frontend muestra resultado al usuario

---

### 4. CARACTERÍSTICAS PRINCIPALES (3-4 min)

**Diapositiva 8: Funcionalidades**
- ✅ Consultas en lenguaje natural
- ✅ Respuestas con referencias legales
- ✅ Historial de conversación
- ✅ Validación de entradas
- ✅ Manejo robusto de errores
- ✅ Interfaz responsive

**Diapositiva 9: Tipos de Datos**
```typescript
// Ejemplo de estructura de mensaje
interface Message {
  id: string;
  type: 'query' | 'response';
  content: string;
  timestamp: Date;
  references?: LegalReference[];
}
```

---

### 5. DEMOSTRACIÓN EN VIVO (3-4 min)

**Diapositiva 10: Demo**
- Mostrar la aplicación funcionando
- Hacer una consulta de ejemplo
- Mostrar el código en VS Code

**Pasos para la demo:**
1. Abrir dos terminales
2. Iniciar backend: `cd backend && npm run dev`
3. Iniciar frontend: `cd frontend && npm run dev`
4. Abrir navegador en `localhost:5173`
5. Mostrar interfaz y funcionalidad básica

---

### 6. CÓDIGO DESTACADO (2-3 min)

**Diapositiva 11: Validación de Datos**
```typescript
// Ejemplo de validación
export function validateQuery(query: string): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!query.trim()) {
    errors.push({
      field: 'query',
      message: 'La consulta no puede estar vacía',
      code: ErrorCode.EMPTY_QUERY
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

**Diapositiva 12: Servidor Express**
```typescript
// Backend simple pero poderoso
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

---

### 7. TESTING Y CALIDAD (2 min)

**Diapositiva 13: Pruebas Automatizadas**
- Tests unitarios con Vitest
- Validación de tipos con TypeScript
- Cobertura de código

```typescript
// Ejemplo de test
it('should validate empty query', () => {
  const result = validateQuery('');
  expect(result.isValid).toBe(false);
  expect(result.errors[0].code).toBe('ERR_1001');
});
```

---

### 8. CONCLUSIONES (2 min)

**Diapositiva 14: Logros**
- ✅ Arquitectura escalable y mantenible
- ✅ Código tipado y seguro
- ✅ Separación clara de responsabilidades
- ✅ Preparado para integración con IA

**Diapositiva 15: Próximos Pasos**
- Integración completa con OpenAI
- Más funcionalidades (exportar conversaciones, favoritos)
- Despliegue en producción
- Mejoras en la interfaz

**Diapositiva 16: Preguntas**
- ¿Preguntas?
- Contacto del equipo

---

## 🎯 Consejos para la Presentación

### Antes de Presentar:
1. **Practica** la demo 3-4 veces
2. **Verifica** que todo funcione (npm install en ambas carpetas)
3. **Prepara** respuestas a preguntas comunes
4. **Ten** un plan B si falla internet/demo

### Durante la Presentación:
1. **Habla claro** y con confianza
2. **Explica** conceptos técnicos de forma simple
3. **Muestra entusiasmo** por el proyecto
4. **Interactúa** con la audiencia
5. **Gestiona** bien el tiempo

### Preguntas Frecuentes:

**P: ¿Por qué separar frontend y backend?**
R: Permite desarrollo independiente, escalabilidad, y reutilización del backend para apps móviles.

**P: ¿Por qué TypeScript y no JavaScript?**
R: TypeScript detecta errores antes de ejecutar, mejora el autocompletado, y hace el código más mantenible.

**P: ¿Cómo se conecta con la IA?**
R: A través de la API de OpenAI, enviando consultas y recibiendo respuestas estructuradas.

**P: ¿Es seguro?**
R: Sí, usa CORS para controlar accesos, validación de datos, y manejo de errores robusto.

---

## 📊 Material de Apoyo

### Recursos para Crear Diapositivas:
- Google Slides (recomendado para colaboración)
- PowerPoint
- Canva (para diseños atractivos)

### Colores Sugeridos:
- Primario: #2563eb (azul profesional)
- Secundario: #10b981 (verde éxito)
- Acento: #f59e0b (naranja atención)
- Fondo: #f8fafc (gris claro)

### Fuentes Recomendadas:
- Títulos: Inter, Poppins, Montserrat
- Texto: Open Sans, Roboto, Lato
- Código: Fira Code, JetBrains Mono

---

## ✅ Checklist Pre-Presentación

- [ ] Diapositivas completas y revisadas
- [ ] Demo probada y funcionando
- [ ] Node.js y npm instalados
- [ ] Dependencias instaladas (`npm install`)
- [ ] Código limpio y comentado
- [ ] Respuestas preparadas para preguntas
- [ ] Tiempo de presentación cronometrado
- [ ] Backup de la demo (video/capturas)
- [ ] Laptop cargada
- [ ] Adaptadores/cables necesarios

---

## 🎬 Script de Ejemplo

**Inicio:**
"Buenos días/tardes. Hoy les presentaremos Smart Tribut, un asistente tributario inteligente que desarrollamos para facilitar consultas sobre impuestos y legislación fiscal."

**Transición a demo:**
"Ahora les mostraremos cómo funciona en tiempo real..."

**Cierre:**
"En conclusión, Smart Tribut demuestra cómo la tecnología moderna puede simplificar procesos complejos. Estamos abiertos a sus preguntas."

---

¡Éxito en tu presentación! 🚀
