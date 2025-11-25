/**
 * Integración de Chat con Botpress y Backend
 * 
 * Funcionalidades:
 * - Generación y persistencia de clientId UUID v4
 * - Inicialización de Botpress con clientId
 * - Captura de mensajes en tiempo real (usuario y bot)
 * - Envío de mensajes a backend (/api/chat/save)
 * - Componente UI para mostrar historial de chat
 * - Vinculación de clientId con userId cuando el usuario se autentica
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'zenubot_clientId';
  const API_BASE_URL = window.CHAT_API_BASE_URL || 'https://api.zenubot.pages.dev';
  const API_KEY = window.CHAT_API_KEY || null; // En producción, debe venir del backend/servidor
  const MESSAGES_PER_PAGE = 50;

  /**
   * Genera un UUID v4
   */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Obtiene o genera un clientId y lo persiste en localStorage
   */
  function getOrCreateClientId() {
    let clientId = localStorage.getItem(STORAGE_KEY);
    
    if (!clientId) {
      clientId = generateUUID();
      localStorage.setItem(STORAGE_KEY, clientId);
      console.log('[ChatIntegration] Nuevo clientId generado:', clientId);
    } else {
      console.log('[ChatIntegration] ClientId recuperado:', clientId);
    }
    
    return clientId;
  }

  /**
   * Obtiene el userId si el usuario está autenticado
   */
  function getUserId() {
    // Adaptar según tu sistema de autenticación
    // Ejemplo: token JWT, cookie, localStorage, etc.
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      try {
        // Decodificar JWT para obtener userId (ejemplo básico)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || null;
      } catch (e) {
        console.warn('[ChatIntegration] Error al decodificar token:', e);
      }
    }
    return null;
  }

  /**
   * Envía un mensaje al backend para guardarlo
   */
  async function saveMessage(messageData) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      // Si hay API_KEY, incluirla (en producción debería venir del backend)
      if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/save`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error(`Error al guardar mensaje: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[ChatIntegration] Mensaje guardado:', result);
      return result;
    } catch (error) {
      console.error('[ChatIntegration] Error al guardar mensaje:', error);
      // No lanzar error para no interrumpir el flujo del chat
    }
  }

  /**
   * Vincula el clientId actual con un userId
   */
  async function linkClientToUser(clientId, userId) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/link`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ clientId, userId })
      });

      if (!response.ok) {
        throw new Error(`Error al vincular clientId: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[ChatIntegration] ClientId vinculado con userId:', result);
      return result;
    } catch (error) {
      console.error('[ChatIntegration] Error al vincular clientId:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de mensajes del backend
   */
  async function getChatHistory(clientId, page = 1, order = 'desc') {
    try {
      const headers = {};
      if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
      }

      const url = new URL(`${API_BASE_URL}/api/chat/history`);
      url.searchParams.append('clientId', clientId);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', MESSAGES_PER_PAGE.toString());
      url.searchParams.append('order', order);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`Error al obtener historial: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[ChatIntegration] Error al obtener historial:', error);
      return { messages: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  /**
   * Inicializa Botpress con el clientId
   */
  function initializeBotpress(clientId, userId = null) {
    // Esperar a que Botpress esté disponible (window.botpress es la API correcta)
    if (!window.botpress || !window.botpress.init) {
      console.warn('[ChatIntegration] Botpress aún no está disponible, reintentando...');
      setTimeout(() => initializeBotpress(clientId, userId), 500);
      return;
    }

    // Si existe userId, vincular clientId con userId en backend
    if (userId) {
      linkClientToUser(clientId, userId).catch(err => {
        console.warn('[ChatIntegration] No se pudo vincular clientId con userId:', err);
      });
    }

    // Si Botpress ya está inicializado (por el componente Angular), solo agregar el clientId
    // De lo contrario, inicializar con configuración completa
    if (window.botpress && typeof window.botpress.init === 'function') {
      // Usar la configuración del componente Angular, pero agregar clientId
      const existingConfig = window.botpress._config || {};
      
      // Si no está inicializado, inicializar con configuración completa
      const config = {
        botId: '25d96f48-f43b-427c-a5d6-952ecfbeacf4',
        configuration: {
          version: 'v2',
          botName: 'Zenubot',
          botDescription: '🤖 Soy Zenubot, un agente de inteligencia artificial desarrollado por ZenuLab.',
          composerPlaceholder: '¿Qué proceso de tu negocio te gustaría automatizar o mejorar hoy?',
          color: '#159F48',
          variant: 'solid',
          headerVariant: 'glass',
          themeMode: 'light',
          fontFamily: 'inter'
        },
        clientId: clientId, // Clave: pasar el clientId persistente
        selector: '#bp-embedded-webchat'
      };

      // Solo inicializar si no está ya inicializado
      if (!window.botpress._initialized) {
        window.botpress.init(config);
        window.botpress._initialized = true;
      } else {
        // Si ya está inicializado, intentar actualizar el clientId si es posible
        console.log('[ChatIntegration] Botpress ya inicializado, clientId:', clientId);
      }
    }

    // Capturar eventos de mensajes
    setupMessageListeners(clientId);
  }

  /**
   * Configura listeners para capturar mensajes del usuario y del bot
   */
  function setupMessageListeners(clientId) {
    // Evento cuando el usuario envía un mensaje
    window.addEventListener('message', async (event) => {
      // Botpress v3 usa eventos de mensaje específicos
      if (event.data && event.data.type === 'webchat:message:sent') {
        const message = event.data.message;
        if (message && message.text) {
          await saveMessage({
            clientId: clientId,
            messageId: message.id || generateUUID(),
            role: 'user',
            text: message.text,
            timestamp: new Date().toISOString(),
            metadata: {
              source: 'botpress',
              ...message.metadata
            }
          });
        }
      }

      // Evento cuando el bot responde
      if (event.data && event.data.type === 'webchat:message:received') {
        const message = event.data.message;
        if (message && message.text) {
          await saveMessage({
            clientId: clientId,
            messageId: message.id || generateUUID(),
            role: 'bot',
            text: message.text,
            timestamp: new Date().toISOString(),
            metadata: {
              source: 'botpress',
              ...message.metadata
            }
          });
        }
      }
    });

    // Usar los eventos de window.botpress si está disponible
    if (window.botpress && typeof window.botpress.on === 'function') {
      // Evento cuando el usuario envía un mensaje
      window.botpress.on('webchat:message:sent', async (event) => {
        if (event && event.text) {
          await saveMessage({
            clientId: clientId,
            messageId: event.id || generateUUID(),
            role: 'user',
            text: event.text,
            timestamp: new Date().toISOString(),
            metadata: {
              source: 'botpress',
              ...(event.metadata || {})
            }
          });
        }
      });

      // Evento cuando el bot responde
      window.botpress.on('webchat:message:received', async (event) => {
        if (event && event.text) {
          await saveMessage({
            clientId: clientId,
            messageId: event.id || generateUUID(),
            role: 'bot',
            text: event.text,
            timestamp: new Date().toISOString(),
            metadata: {
              source: 'botpress',
              ...(event.metadata || {})
            }
          });
        }
      });
    }

    console.log('[ChatIntegration] Listeners de mensajes configurados');
  }

  /**
   * Componente UI para mostrar el historial de chat
   */
  class ChatHistoryComponent {
    constructor(clientId, containerId = 'chat-history-container') {
      this.clientId = clientId;
      this.containerId = containerId;
      this.currentPage = 1;
      this.totalPages = 1;
      this.order = 'desc'; // 'asc' o 'desc'
      this.messages = [];
    }

    /**
     * Renderiza el componente en el contenedor
     */
    async render() {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.warn(`[ChatHistoryComponent] Contenedor #${this.containerId} no encontrado`);
        return;
      }

      container.innerHTML = this.getHTML();
      
      // Cargar mensajes
      await this.loadMessages();

      // Configurar event listeners
      this.setupEventListeners();
    }

    /**
     * Obtiene el HTML del componente
     */
    getHTML() {
      return `
        <div class="chat-history-wrapper" style="
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0; font-size: 1.5rem; font-weight: 600; color: #1f2937;">
              Historial de Chat
            </h3>
            <button id="btn-link-account" class="btn-link-account" style="
              padding: 0.5rem 1rem;
              background: #159F48;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              transition: background 0.2s;
            " onmouseover="this.style.background='#13843a'" onmouseout="this.style.background='#159F48'">
              Vincular a mi cuenta
            </button>
          </div>

          <div id="chat-history-messages" style="
            max-height: 500px;
            overflow-y: auto;
            margin-bottom: 1rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
          ">
            <div style="text-align: center; color: #6b7280; padding: 2rem;">
              Cargando historial...
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <button id="btn-order-toggle" style="
              padding: 0.5rem 1rem;
              background: #e5e7eb;
              color: #374151;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
            ">
              Orden: ${this.order === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
            </button>
            
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <button id="btn-prev-page" style="
                padding: 0.5rem 1rem;
                background: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
              " disabled>
                Anterior
              </button>
              <span id="page-info" style="
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                color: #6b7280;
              ">
                Página 1 de 1
              </span>
              <button id="btn-next-page" style="
                padding: 0.5rem 1rem;
                background: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
              " disabled>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      `;
    }

    /**
     * Carga los mensajes desde el backend
     */
    async loadMessages() {
      const messagesContainer = document.getElementById('chat-history-messages');
      if (!messagesContainer) return;

      messagesContainer.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 2rem;">Cargando...</div>';

      const data = await getChatHistory(this.clientId, this.currentPage, this.order);
      this.messages = data.messages || [];
      this.totalPages = data.totalPages || 1;

      this.renderMessages();
      this.updatePagination();
    }

    /**
     * Renderiza la lista de mensajes
     */
    renderMessages() {
      const messagesContainer = document.getElementById('chat-history-messages');
      if (!messagesContainer) return;

      if (this.messages.length === 0) {
        messagesContainer.innerHTML = `
          <div style="text-align: center; color: #6b7280; padding: 2rem;">
            No hay mensajes en el historial aún.
          </div>
        `;
        return;
      }

      messagesContainer.innerHTML = this.messages.map(msg => {
        const isUser = msg.role === 'user';
        const align = isUser ? 'right' : 'left';
        const bgColor = isUser ? '#159F48' : '#e5e7eb';
        const textColor = isUser ? 'white' : '#1f2937';

        const date = new Date(msg.created_at || msg.timestamp);
        const formattedDate = date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return `
          <div style="
            margin-bottom: 1rem;
            display: flex;
            justify-content: ${align};
          ">
            <div style="
              max-width: 70%;
              padding: 0.75rem 1rem;
              background: ${bgColor};
              color: ${textColor};
              border-radius: ${isUser ? '12px 12px 0 12px' : '12px 12px 12px 0'};
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            ">
              <div style="font-size: 0.875rem; line-height: 1.5; margin-bottom: 0.25rem;">
                ${escapeHtml(msg.text)}
              </div>
              <div style="
                font-size: 0.75rem;
                opacity: 0.7;
                margin-top: 0.25rem;
              ">
                ${formattedDate}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    /**
     * Actualiza los controles de paginación
     */
    updatePagination() {
      const prevBtn = document.getElementById('btn-prev-page');
      const nextBtn = document.getElementById('btn-next-page');
      const pageInfo = document.getElementById('page-info');

      if (prevBtn) {
        prevBtn.disabled = this.currentPage <= 1;
      }
      if (nextBtn) {
        nextBtn.disabled = this.currentPage >= this.totalPages;
      }
      if (pageInfo) {
        pageInfo.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
      }
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
      const prevBtn = document.getElementById('btn-prev-page');
      const nextBtn = document.getElementById('btn-next-page');
      const orderToggle = document.getElementById('btn-order-toggle');
      const linkBtn = document.getElementById('btn-link-account');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (this.currentPage > 1) {
            this.currentPage--;
            this.loadMessages();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadMessages();
          }
        });
      }

      if (orderToggle) {
        orderToggle.addEventListener('click', () => {
          this.order = this.order === 'desc' ? 'asc' : 'desc';
          this.currentPage = 1;
          this.loadMessages();
        });
      }

      if (linkBtn) {
        linkBtn.addEventListener('click', () => {
          this.handleLinkAccount();
        });
      }
    }

    /**
     * Maneja la vinculación de la cuenta
     */
    async handleLinkAccount() {
      const userId = getUserId();
      
      if (!userId) {
        // Redirigir a login o mostrar modal de autenticación
        alert('Por favor, inicia sesión para vincular tu cuenta.');
        // window.location.href = '/login'; // Adaptar según tu ruta de login
        return;
      }

      try {
        await linkClientToUser(this.clientId, userId);
        alert('¡Cuenta vinculada exitosamente! Tu historial de chat ahora está asociado a tu cuenta.');
        // Recargar historial
        await this.loadMessages();
      } catch (error) {
        alert('Error al vincular la cuenta. Por favor, intenta de nuevo.');
        console.error('[ChatHistoryComponent] Error al vincular:', error);
      }
    }
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Inicializa la integración cuando el DOM está listo
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Obtener o crear clientId
    const clientId = getOrCreateClientId();
    const userId = getUserId();

    // Inicializar Botpress
    initializeBotpress(clientId, userId);

    // Si existe un contenedor para el historial, inicializar el componente
    if (document.getElementById('chat-history-container')) {
      const historyComponent = new ChatHistoryComponent(clientId, 'chat-history-container');
      historyComponent.render();
    }

    // Exponer funciones globales útiles
    window.zenubotChat = {
      getClientId: () => clientId,
      linkAccount: (userId) => linkClientToUser(clientId, userId),
      getHistory: (page, order) => getChatHistory(clientId, page, order),
      refreshHistory: () => {
        const component = window.zenubotChatHistoryComponent;
        if (component) component.loadMessages();
      }
    };
  }

  // Inicializar
  init();

})();

