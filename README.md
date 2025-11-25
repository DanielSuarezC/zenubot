# Integración de Chat con Botpress y Backend

Este proyecto implementa una integración completa entre el widget de Botpress y un backend propio para almacenar y consultar el historial de conversaciones del chat.

## 📋 Características

- ✅ **Identificación persistente**: Genera y almacena un `clientId` UUID v4 en `localStorage`
- ✅ **Captura en tiempo real**: Captura automáticamente cada mensaje (usuario y bot) y lo envía al backend
- ✅ **Historial consultable**: Componente UI para visualizar el historial de mensajes con paginación
- ✅ **Vinculación de cuentas**: Permite asociar el `clientId` con un `userId` cuando el usuario se registra
- ✅ **Backend API**: Endpoints RESTful para guardar, consultar y vincular mensajes
- ✅ **Persistencia**: Base de datos PostgreSQL (compatible con Supabase)
- ✅ **Seguridad**: Autenticación mediante API Key (Bearer token)

## 🏗️ Estructura del Proyecto

```
.
├── landing/
│   └── chat-integration.js    # Script de integración para la landing page
├── backend/
│   ├── index.js               # Servidor Express con endpoints API
│   └── package.json           # Dependencias del backend
├── sql/
│   └── schema.sql             # Esquema de base de datos PostgreSQL
├── tests/
│   ├── chat-api.test.js       # Tests básicos de la API
│   └── integration.test.js    # Tests de integración end-to-end
└── README.md                  # Esta documentación
```

## 🚀 Instalación y Configuración

### 1. Base de Datos (PostgreSQL)

#### Opción A: Supabase (Recomendado para producción)

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ir a SQL Editor y ejecutar el script `sql/schema.sql`
3. Obtener la URL de conexión desde Settings > Database > Connection string

#### Opción B: PostgreSQL Local

```bash
# Instalar PostgreSQL (si no está instalado)
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Crear base de datos
createdb zenubot_chat

# Ejecutar script SQL
psql -d zenubot_chat -f sql/schema.sql
```

### 2. Backend

```bash
# Ir al directorio backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar desde .env.example)
# Windows:
copy .env.example .env
# Linux/macOS:
cp .env.example .env

# Editar .env con tus credenciales
```

#### Variables de Entorno del Backend

Crear archivo `backend/.env`:

```env
# Puerto del servidor
PORT=3000

# Modo de ejecución
NODE_ENV=production

# URL de conexión a PostgreSQL
# Para Supabase:
DATABASE_URL=postgresql://usuario:password@host:5432/database?sslmode=require
# Para PostgreSQL local:
# DATABASE_URL=postgresql://usuario:password@localhost:5432/zenubot_chat

# Si la conexión requiere SSL
DATABASE_SSL=true

# API Key para autenticación (generar una clave segura)
# Generar clave: openssl rand -hex 32
API_KEY=tu-api-key-secreta-aqui
```

#### Iniciar el Backend

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto especificado en `.env`).

### 3. Frontend (Landing Page)

#### Integrar el Script

Agregar el script de integración en tu `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- ... -->
</head>
<body>
  <!-- ... tu contenido ... -->
  
  <!-- Botpress Webchat (ya incluido) -->
  <script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
  
  <!-- Integración de chat (AGREGAR ESTE SCRIPT) -->
  <script>
    // Configuración de la API
    window.CHAT_API_BASE_URL = 'https://api.zenubot.pages.dev'; // URL de tu backend
    // NO incluir API_KEY aquí en producción (usar proxy o serverless function)
  </script>
  <script src="/landing/chat-integration.js"></script>
  
  <!-- Contenedor opcional para el historial de chat -->
  <div id="chat-history-container"></div>
</body>
</html>
```

#### Configuración en Angular (si aplica)

Si usas Angular, puedes agregar el script en `angular.json`:

```json
{
  "projects": {
    "mente-zenu-landing": {
      "architect": {
        "build": {
          "options": {
            "scripts": [
              "landing/chat-integration.js"
            ]
          }
        }
      }
    }
  }
}
```

## 📡 Endpoints de la API

### POST `/api/chat/save`

Guarda un mensaje en el historial.

**Headers:**
```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

**Body:**
```json
{
  "clientId": "uuid-v4",
  "messageId": "msg-id-from-botpress",
  "role": "user" | "bot",
  "text": "Contenido del mensaje",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "metadata": {
    "source": "botpress",
    "additional": "data"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Mensaje guardado exitosamente",
  "data": {
    "id": "uuid",
    "clientId": "uuid-v4",
    "messageId": "msg-id-from-botpress",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### GET `/api/chat/history`

Obtiene el historial de mensajes por `clientId`.

**Headers:**
```
Authorization: Bearer <API_KEY>
```

**Query Parameters:**
- `clientId` (requerido): ID del cliente
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 50, max: 100): Mensajes por página
- `order` (opcional, default: "desc"): Orden de mensajes ("asc" o "desc")

**Ejemplo:**
```
GET /api/chat/history?clientId=uuid-v4&page=1&limit=50&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "clientId": "uuid-v4",
        "userId": null,
        "role": "user",
        "text": "Hola",
        "messageId": "msg-123",
        "metadata": null,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### POST `/api/chat/link`

Vincula un `clientId` con un `userId`.

**Headers:**
```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

**Body:**
```json
{
  "clientId": "uuid-v4",
  "userId": "user-123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "ClientId vinculado con userId exitosamente",
  "data": {
    "clientId": "uuid-v4",
    "userId": "user-123",
    "messagesLinked": 25
  }
}
```

### GET `/api/chat/stats` (Opcional)

Obtiene estadísticas del chat por `clientId`.

**Query Parameters:**
- `clientId` (requerido): ID del cliente

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientId": "uuid-v4",
    "totalMessages": 50,
    "userMessages": 25,
    "botMessages": 25,
    "firstMessageAt": "2024-01-01T12:00:00.000Z",
    "lastMessageAt": "2024-01-02T12:00:00.000Z",
    "activeDays": 2
  }
}
```

## 🔒 Seguridad

### Protección de API Key

**⚠️ IMPORTANTE**: Nunca expongas la `API_KEY` en el código frontend.

#### Opción 1: Proxy Serverless (Recomendado)

Usar una función serverless como proxy que agregue el token:

**Ejemplo con Cloudflare Workers:**

```javascript
// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Solo permitir requests a /api/chat/*
  if (!url.pathname.startsWith('/api/chat/')) {
    return new Response('Not Found', { status: 404 })
  }
  
  // Crear nuevo request con API_KEY agregada
  const newRequest = new Request(request.url, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      'Authorization': `Bearer ${API_KEY}` // Variable de entorno del worker
    },
    body: request.body
  })
  
  // Proxificar al backend real
  return fetch(`https://tu-backend.com${url.pathname}${url.search}`, newRequest)
}
```

#### Opción 2: Headers desde el Backend

Si tu frontend y backend están en el mismo dominio, puedes agregar el token en el servidor.

#### Opción 3: CORS Restringido

Configurar CORS en el backend para solo permitir requests desde tu dominio:

```javascript
// backend/index.js
const corsOptions = {
  origin: ['https://zenubot.pages.dev', 'https://tu-dominio.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### Generar API Key Segura

```bash
# Generar una clave segura de 32 bytes (hex)
openssl rand -hex 32

# O usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚢 Despliegue

### Backend en Cloudflare Workers / Pages Functions

1. Crear función en `functions/api/chat/[...slug].js`:

```javascript
export async function onRequestPost(context) {
  const { request, env } = context;
  // Proxificar request al backend real con API_KEY
  const url = new URL(request.url);
  url.hostname = 'tu-backend.com';
  
  const newRequest = new Request(url, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      'Authorization': `Bearer ${env.API_KEY}`
    },
    body: request.body
  });
  
  return fetch(newRequest);
}
```

### Backend en Vercel Serverless

1. Crear archivo `api/chat/[...slug].js`:

```javascript
module.exports = async (req, res) => {
  const apiKey = process.env.API_KEY;
  // ... lógica del endpoint
};
```

2. Configurar variables de entorno en Vercel Dashboard:
   - `API_KEY`
   - `DATABASE_URL`

### Backend en VPS (Node.js)

1. Usar PM2 para mantener el proceso activo:

```bash
npm install -g pm2
pm2 start backend/index.js --name zenubot-api
pm2 save
pm2 startup
```

2. Configurar Nginx como reverse proxy:

```nginx
server {
    listen 80;
    server_name api.zenubot.pages.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Testing

```bash
# Instalar dependencias de testing (si no están instaladas)
npm install --save-dev jest supertest

# Ejecutar tests
cd backend
npm test

# O ejecutar tests manualmente
node ../tests/chat-api.test.js
```

## 📝 Uso

### En el Frontend

El script `chat-integration.js` se inicializa automáticamente cuando se carga la página.

#### Obtener clientId actual:

```javascript
const clientId = window.zenubotChat?.getClientId();
console.log('ClientId actual:', clientId);
```

#### Vincular cuenta manualmente:

```javascript
const userId = 'user-123'; // Obtener del sistema de autenticación
await window.zenubotChat?.linkAccount(userId);
```

#### Obtener historial:

```javascript
const history = await window.zenubotChat?.getHistory(1, 'desc');
console.log('Historial:', history);
```

#### Refrescar historial en la UI:

```javascript
window.zenubotChat?.refreshHistory();
```

### Componente de Historial

Para mostrar el componente de historial en tu página, agrega:

```html
<div id="chat-history-container"></div>
```

El componente se renderiza automáticamente y permite:
- Ver mensajes con paginación
- Cambiar orden (más recientes primero / más antiguos primero)
- Vincular cuenta con botón "Vincular a mi cuenta"

## 🔧 Troubleshooting

### Error: "API_KEY no configurada"

En desarrollo, si no hay `API_KEY` configurada, el backend permitirá acceso sin autenticación (con advertencia en consola).

En producción, **siempre** configura una `API_KEY` segura.

### Error: "Conexión a la base de datos fallida"

Verificar:
1. Que `DATABASE_URL` esté correctamente configurada en `.env`
2. Que la base de datos esté accesible (firewall, credenciales)
3. Que el script SQL se haya ejecutado correctamente

### Los mensajes no se guardan

Verificar:
1. Que el script `chat-integration.js` esté cargado
2. Que la URL del backend sea correcta (`CHAT_API_BASE_URL`)
3. Que no haya errores en la consola del navegador
4. Que el backend esté funcionando (verificar `/health`)

### El historial no se muestra

Verificar:
1. Que exista el contenedor `#chat-history-container` en el DOM
2. Que el `clientId` esté correctamente almacenado en `localStorage`
3. Que haya mensajes guardados en la base de datos para ese `clientId`

## 📚 Recursos Adicionales

- [Documentación de Botpress Webchat](https://botpress.com/docs/channels/webchat)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)

## 📄 Licencia

MIT

## 👥 Contribuidores

ZenuLab - Innovación que Fluye, Raíces que Crecen.
