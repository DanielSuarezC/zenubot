-- Esquema de base de datos para integración de chat con Botpress
-- Base de datos: PostgreSQL

-- Tabla para almacenar mensajes del chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT NOT NULL,
    user_id TEXT NULL, -- Se llena cuando se vincula el clientId con un usuario
    role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
    text TEXT NOT NULL,
    message_id TEXT NOT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_chat_messages_client_id ON chat_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_client_created ON chat_messages(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_id ON chat_messages(message_id);

-- Índice compuesto para consultas por clientId y orden por fecha
CREATE INDEX IF NOT EXISTS idx_chat_messages_client_date ON chat_messages(client_id, created_at DESC);

-- Índice GIN para búsquedas en metadata JSONB
CREATE INDEX IF NOT EXISTS idx_chat_messages_metadata ON chat_messages USING GIN (metadata);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER trigger_update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_messages_updated_at();

-- Vista para estadísticas por clientId (opcional)
CREATE OR REPLACE VIEW chat_messages_stats AS
SELECT 
    client_id,
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE role = 'user') as user_messages,
    COUNT(*) FILTER (WHERE role = 'bot') as bot_messages,
    MIN(created_at) as first_message_at,
    MAX(created_at) as last_message_at,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) as linked_users
FROM chat_messages
GROUP BY client_id;

-- Comentarios en las columnas para documentación
COMMENT ON TABLE chat_messages IS 'Almacena todos los mensajes del chat entre usuarios y el bot';
COMMENT ON COLUMN chat_messages.id IS 'ID único del mensaje (UUID)';
COMMENT ON COLUMN chat_messages.client_id IS 'ID único del cliente (generado en el frontend, UUID v4)';
COMMENT ON COLUMN chat_messages.user_id IS 'ID del usuario autenticado (se asocia después del registro)';
COMMENT ON COLUMN chat_messages.role IS 'Rol del mensaje: user o bot';
COMMENT ON COLUMN chat_messages.text IS 'Contenido del mensaje';
COMMENT ON COLUMN chat_messages.message_id IS 'ID del mensaje desde Botpress';
COMMENT ON COLUMN chat_messages.metadata IS 'Metadatos adicionales del mensaje (JSON)';
COMMENT ON COLUMN chat_messages.created_at IS 'Fecha y hora de creación del mensaje';
COMMENT ON COLUMN chat_messages.updated_at IS 'Fecha y hora de última actualización';

-- Permisos (ajustar según necesidades)
-- GRANT SELECT, INSERT, UPDATE ON chat_messages TO zenubot_user;
-- GRANT SELECT ON chat_messages_stats TO zenubot_user;

-- Ejemplo de consulta para obtener historial paginado
-- SELECT * FROM chat_messages 
-- WHERE client_id = 'xxx-xxx-xxx' 
-- ORDER BY created_at DESC 
-- LIMIT 50 OFFSET 0;




