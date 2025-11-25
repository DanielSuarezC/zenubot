/**
 * Backend API para integración de chat con Botpress
 * 
 * Endpoints:
 * - POST /api/chat/save - Guarda un mensaje en el historial
 * - GET /api/chat/history - Obtiene el historial de mensajes por clientId
 * - POST /api/chat/link - Vincula un clientId con un userId
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Middleware de autenticación (Bearer token)
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  const apiKey = process.env.API_KEY || process.env.CHAT_API_KEY;

  if (!apiKey) {
    // Si no hay API_KEY configurada, permitir acceso (solo para desarrollo)
    console.warn('[WARNING] API_KEY no configurada. Acceso sin autenticación.');
    return next();
  }

  if (!token || token !== apiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Token de autenticación inválido o faltante'
    });
  }

  next();
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'zenubot-chat-api'
  });
});

/**
 * POST /api/chat/save
 * Guarda un mensaje en el historial
 * 
 * Body:
 * {
 *   clientId: string (requerido)
 *   messageId: string (requerido)
 *   role: "user" | "bot" (requerido)
 *   text: string (requerido)
 *   timestamp: string (ISO 8601)
 *   metadata: object (opcional)
 * }
 */
app.post('/api/chat/save', authenticate, async (req, res) => {
  try {
    const { clientId, messageId, role, text, timestamp, metadata } = req.body;

    // Validaciones
    if (!clientId || !messageId || !role || !text) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Faltan campos requeridos: clientId, messageId, role, text'
      });
    }

    if (!['user', 'bot'].includes(role)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El campo role debe ser "user" o "bot"'
      });
    }

    // Usar timestamp proporcionado o el actual
    const createdAt = timestamp ? new Date(timestamp) : new Date();

    // Insertar mensaje en la base de datos
    const query = `
      INSERT INTO chat_messages (
        id,
        client_id,
        user_id,
        role,
        text,
        message_id,
        metadata,
        created_at
      ) VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING id, created_at
    `;

    const values = [
      clientId,
      null, // user_id será null hasta que se vincule
      role,
      text,
      messageId,
      metadata ? JSON.stringify(metadata) : null,
      createdAt
    ];

    const result = await pool.query(query, values);
    const savedMessage = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Mensaje guardado exitosamente',
      data: {
        id: savedMessage.id,
        clientId: clientId,
        messageId: messageId,
        createdAt: savedMessage.created_at
      }
    });

  } catch (error) {
    console.error('[POST /api/chat/save] Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al guardar el mensaje',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/chat/history
 * Obtiene el historial de mensajes por clientId
 * 
 * Query params:
 * - clientId: string (requerido)
 * - page: number (opcional, default: 1)
 * - limit: number (opcional, default: 50)
 * - order: "asc" | "desc" (opcional, default: "desc")
 */
app.get('/api/chat/history', authenticate, async (req, res) => {
  try {
    const { clientId, page = 1, limit = 50, order = 'desc' } = req.query;

    if (!clientId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El parámetro clientId es requerido'
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Los parámetros page y limit deben ser números positivos. limit máximo: 100'
      });
    }

    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El parámetro order debe ser "asc" o "desc"'
      });
    }

    // Contar total de mensajes
    const countQuery = `
      SELECT COUNT(*) as total
      FROM chat_messages
      WHERE client_id = $1
    `;
    const countResult = await pool.query(countQuery, [clientId]);
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limitNum);

    // Obtener mensajes paginados
    const messagesQuery = `
      SELECT 
        id,
        client_id,
        user_id,
        role,
        text,
        message_id,
        metadata,
        created_at
      FROM chat_messages
      WHERE client_id = $1
      ORDER BY created_at ${order.toUpperCase()}
      LIMIT $2
      OFFSET $3
    `;

    const messagesResult = await pool.query(messagesQuery, [clientId, limitNum, offset]);

    // Formatear mensajes
    const messages = messagesResult.rows.map(row => ({
      id: row.id,
      clientId: row.client_id,
      userId: row.user_id,
      role: row.role,
      text: row.text,
      messageId: row.message_id,
      metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : null,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: {
        messages: messages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('[GET /api/chat/history] Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener el historial',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/chat/link
 * Vincula un clientId con un userId
 * 
 * Body:
 * {
 *   clientId: string (requerido)
 *   userId: string (requerido)
 * }
 */
app.post('/api/chat/link', authenticate, async (req, res) => {
  try {
    const { clientId, userId } = req.body;

    if (!clientId || !userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Los campos clientId y userId son requeridos'
      });
    }

    // Actualizar todos los mensajes del clientId para asociarlos al userId
    const updateQuery = `
      UPDATE chat_messages
      SET user_id = $1
      WHERE client_id = $2
        AND (user_id IS NULL OR user_id != $1)
      RETURNING COUNT(*) as updated_count
    `;

    const result = await pool.query(updateQuery, [userId, clientId]);

    // También podemos guardar una relación clientId -> userId para futuras referencias
    // Esto depende de si quieres una tabla adicional para tracking

    res.json({
      success: true,
      message: 'ClientId vinculado con userId exitosamente',
      data: {
        clientId: clientId,
        userId: userId,
        messagesLinked: parseInt(result.rows[0]?.updated_count || 0, 10)
      }
    });

  } catch (error) {
    console.error('[POST /api/chat/link] Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al vincular clientId con userId',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/chat/stats?clientId=xxx
 * Obtiene estadísticas del chat (opcional)
 */
app.get('/api/chat/stats', authenticate, async (req, res) => {
  try {
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El parámetro clientId es requerido'
      });
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE role = 'user') as user_messages,
        COUNT(*) FILTER (WHERE role = 'bot') as bot_messages,
        MIN(created_at) as first_message_at,
        MAX(created_at) as last_message_at,
        COUNT(DISTINCT DATE(created_at)) as active_days
      FROM chat_messages
      WHERE client_id = $1
    `;

    const result = await pool.query(statsQuery, [clientId]);
    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        clientId: clientId,
        totalMessages: parseInt(stats.total_messages, 10),
        userMessages: parseInt(stats.user_messages, 10),
        botMessages: parseInt(stats.bot_messages, 10),
        firstMessageAt: stats.first_message_at,
        lastMessageAt: stats.last_message_at,
        activeDays: parseInt(stats.active_days, 10)
      }
    });

  } catch (error) {
    console.error('[GET /api/chat/stats] Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener estadísticas',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint no encontrado'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Error inesperado en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a la base de datos establecida');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// Cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando conexión a la base de datos...');
  await pool.end();
  process.exit(0);
});

module.exports = app;




