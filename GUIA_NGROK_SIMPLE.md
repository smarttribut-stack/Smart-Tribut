# ngrok - Compartir tu App en 5 Minutos

## ¿Qué hace ngrok?
Convierte `localhost:5173` en un link público como `https://abc123.ngrok.io` que cualquiera puede abrir.

---

## Paso 1: Descargar ngrok (2 min)

1. Ve a **ngrok.com/download**
2. Descarga para Windows
3. Descomprime el archivo
4. Crea cuenta gratis en **ngrok.com/signup**
5. Copia tu token del dashboard

---

## Paso 2: Configurar (1 min)

Abre una terminal y escribe:

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

---

## Paso 3: Iniciar tu app (2 min)

Abre 2 terminales:

**Terminal 1:**
```bash
cd frontend
npm run dev
```

**Terminal 2:**
```bash
ngrok http 5173
```

---

## Paso 4: Copiar el link

En la Terminal 2 verás:
```
Forwarding    https://xyz789.ngrok.io -> localhost:5173
```

**Ese es tu link público** → Compártelo con quien quieras

---

## ✅ Listo

Abre `https://xyz789.ngrok.io` en cualquier dispositivo y funcionará.

---

## ⚠️ Importante

- El link cambia cada vez que reinicias ngrok
- Si cierras la terminal, el link deja de funcionar
- Perfecto para demos y presentaciones
