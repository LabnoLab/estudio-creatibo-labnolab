# Configuración de Supabase para Radar de Futuros

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

## 2. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

## 3. Crear la Tabla en Supabase

1. Ve al SQL Editor en tu dashboard de Supabase
2. Ejecuta el siguiente script SQL (disponible en `supabase-schema.sql`):

```sql
-- Crear tabla para almacenar análisis de tendencias
CREATE TABLE trend_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    source_url TEXT,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para optimizar consultas por fecha
CREATE INDEX idx_trend_analyses_created_at ON trend_analyses(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE trend_analyses ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (ajustar según necesidades de seguridad)
CREATE POLICY "Allow all operations on trend_analyses" ON trend_analyses
    FOR ALL USING (true);
```

## 4. Funcionalidades Implementadas

- **Guardado automático**: Cada análisis se guarda automáticamente en Supabase
- **Historial en sidebar**: Los últimos 10 análisis aparecen en el sidebar izquierdo
- **Carga de análisis previos**: Click en cualquier item del historial para cargar ese análisis
- **Persistencia de datos**: Los análisis se conservan entre sesiones

## 5. Estructura de Datos

La tabla `trend_analyses` almacena:
- `id`: UUID único del análisis
- `title`: Título extraído del análisis
- `source_url`: URL original (si se analizó una URL)
- `analysis_data`: Todo el objeto JSON del análisis completo
- `created_at`: Timestamp de creación

## 6. Notas de Seguridad

⚠️ **Importante**: La política actual permite todas las operaciones sin autenticación. Para producción, considera implementar:
- Autenticación de usuarios
- Políticas RLS más restrictivas
- Límites de uso por usuario 