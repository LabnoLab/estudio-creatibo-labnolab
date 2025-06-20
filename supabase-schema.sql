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