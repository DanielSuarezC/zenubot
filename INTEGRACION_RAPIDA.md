# Guía Rápida de Integración

## 🚀 Pasos Rápidos

### 1. Base de Datos
```bash
# Ejecutar el script SQL en tu base de datos PostgreSQL
psql -d tu_base_de_datos -f sql/schema.sql

# O en Supabase: pegar el contenido de sql/schema.sql en SQL Editor
```

### 2. Backend
```bash
cd backend
npm install
cp env.example .env
# Editar .env con tus credenciales
npm start
```

### 3. Frontend

#### Opción A: Integrar en Angular

1. Copiar `landing/chat-integration.js` a `src/assets/chat-integration.js`

2. Modificar `src/index.html`:

```html
<body>
  <app-root></app-root>
  
  <!-- Botpress Webchat Integration -->
  <script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
  <script src="https://files.bpcontent.cloud/2025/11/05/14/20251105144538-9LDUEOXY.js" defer></script>
  
  <!-- Integración de chat -->
  <script>
    window.CHAT_API_BASE_URL = 'https://tu-backend.com'; // URL de tu backend
  </script>
  <script src="assets/chat-integration.js"></script>
</body>
```

3. (Opcional) Modificar `zenubot.component.ts` para usar el clientId persistente:

```typescript
// En initializeBotpress(), cambiar:
clientId: '96122d4a-eff7-459e-bf53-3a9c2bad7d19', // ❌ ID fijo

// Por:
clientId: this.getOrCreateClientId(), // ✅ ID persistente

// Agregar método:
private getOrCreateClientId(): string {
  const storageKey = 'zenubot_clientId';
  let clientId = localStorage.getItem(storageKey);
  
  if (!clientId) {
    clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(storageKey, clientId);
  }
  
  return clientId;
}
```

#### Opción B: Usar el Script Directamente

Si no usas Angular o prefieres integrarlo directamente:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... -->
</head>
<body>
  <!-- ... -->
  
  <!-- Botpress -->
  <script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"></script>
  
  <!-- Configuración -->
  <script>
    window.CHAT_API_BASE_URL = 'https://tu-backend.com';
  </script>
  
  <!-- Integración -->
  <script src="landing/chat-integration.js"></script>
  
  <!-- Contenedor del chat (si usas embedded) -->
  <div id="bp-embedded-webchat"></div>
  
  <!-- Contenedor del historial (opcional) -->
  <div id="chat-history-container"></div>
</body>
</html>
```

### 4. Verificar Funcionamiento

1. Abrir la landing page
2. Abrir DevTools → Console
3. Buscar: `[ChatIntegration] Nuevo clientId generado:` o `[ChatIntegration] ClientId recuperado:`
4. Enviar un mensaje en el chat
5. Verificar en la consola: `[ChatIntegration] Mensaje guardado:`
6. Verificar en la base de datos que el mensaje se guardó

### 5. Probar Endpoints

```bash
# Health check
curl https://tu-backend.com/health

# Obtener historial (reemplazar CLIENT_ID y API_KEY)
curl -H "Authorization: Bearer API_KEY" \
  "https://tu-backend.com/api/chat/history?clientId=CLIENT_ID"
```

## 🔑 Variables de Entorno Críticas

**Backend (.env):**
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `API_KEY`: Clave secreta para autenticación

**Frontend (script):**
- `window.CHAT_API_BASE_URL`: URL del backend

## ⚠️ Notas Importantes

1. **API_KEY en Frontend**: Nunca expongas la `API_KEY` en el frontend. Usa un proxy serverless o configura CORS en el backend.

2. **ClientId Persistente**: El script genera automáticamente un `clientId` y lo guarda en `localStorage`. Si el usuario limpia el almacenamiento, se generará uno nuevo.

3. **Captura de Eventos**: El script captura eventos de Botpress. Si Botpress ya está inicializado por otro componente (como en Angular), el script se adaptará automáticamente.

4. **Historial**: El componente de historial se renderiza automáticamente si existe el contenedor `#chat-history-container` en el DOM.

## 📞 Soporte

Para problemas o preguntas, consulta `README.md` para documentación completa.

