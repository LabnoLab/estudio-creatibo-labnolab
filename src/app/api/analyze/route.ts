import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

// Tipo para la configuración
interface AnalysisConfig {
  settings: {
    openai: {
      model: string;
      temperature: number;
      maxTokens: number;
    };
    analysis: {
      minPromptLength: number;
      maxTopDimensions: number;
      responseLanguage: string;
    };
  };
  systemPrompt: {
    content: string;
  };
  dimensions: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    keywords: string[];
  }>;
  responseFormat: {
    schema: any;
  };
}

// Función para cargar la configuración
function loadAnalysisConfig(): AnalysisConfig {
  try {
    const configPath = join(process.cwd(), 'src', 'config', 'analysis-config.json');
    const configFile = readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile) as AnalysisConfig;
    
    console.log('📋 [CONFIG] Configuración cargada exitosamente');
    console.log('📊 [CONFIG] Dimensiones disponibles:', config.dimensions.length);
    console.log('🤖 [CONFIG] Modelo:', config.settings.openai.model);
    
    return config;
  } catch (error: any) {
    console.error('❌ [CONFIG] Error cargando configuración:', error.message);
    throw new Error(`No se pudo cargar la configuración: ${error.message}`);
  }
}

// Función para validar el análisis según la configuración
function validateAnalysisResult(result: any, config: AnalysisConfig): any {
  console.log('🔍 [VALIDATION] Iniciando validación del resultado...');
  
  if (!result || typeof result !== 'object') {
    throw new Error('Formato de respuesta incorrecto: no es un objeto');
  }

  if (!result.dimensions || typeof result.dimensions !== 'object') {
    throw new Error('Formato de respuesta incorrecto: falta dimensions');
  }

  if (!result.topDimensions || !Array.isArray(result.topDimensions)) {
    throw new Error('Formato de respuesta incorrecto: falta topDimensions');
  }

  // Validar que todas las dimensiones esperadas estén presentes
  const expectedDimensions = config.dimensions.map(d => d.id);
  const missingDimensions = expectedDimensions.filter(dim => 
    !(dim in result.dimensions) || 
    typeof result.dimensions[dim] !== 'number'
  );

  if (missingDimensions.length > 0) {
    console.log('⚠️ [VALIDATION] Dimensiones faltantes:', missingDimensions);
    // Añadir dimensiones faltantes con valor por defecto
    missingDimensions.forEach(dim => {
      result.dimensions[dim] = 0;
    });
  }

  // Validar topDimensions
  if (result.topDimensions.length === 0) {
    console.log('⚠️ [VALIDATION] No hay topDimensions, generando automáticamente');
    // Generar topDimensions desde dimensions si está vacío
    const sortedDimensions = Object.entries(result.dimensions)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, config.settings.analysis.maxTopDimensions)
      .map(([dimensionId, percentage]) => {
        const dimensionConfig = config.dimensions.find(d => d.id === dimensionId);
        return {
          name: dimensionId,
          label: dimensionConfig?.name || dimensionId,
          percentage: percentage as number,
          reasoning: "Dimensión identificada automáticamente por el análisis"
        };
      });
    
    result.topDimensions = sortedDimensions;
  }

  // Asegurar que los labels de topDimensions correspondan a los nombres configurados
  result.topDimensions = result.topDimensions.map((topDim: any) => {
    const dimensionConfig = config.dimensions.find(d => d.id === topDim.name);
    return {
      ...topDim,
      label: dimensionConfig?.name || topDim.label
    };
  });

  console.log('✅ [VALIDATION] Validación completada exitosamente');
  console.log('📊 [VALIDATION] Top dimensions:', result.topDimensions.length);

  return result;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [ANALYZE API] Iniciando análisis...');
    
    // Cargar configuración
    const config = loadAnalysisConfig();
    
    const { prompt } = await request.json();
    console.log('📝 [ANALYZE API] Prompt length:', prompt?.length);
    
    // Debug de variables de entorno
    console.log('🔍 [ANALYZE API] Debugging API Key...');
    console.log('📊 [ANALYZE API] NODE_ENV:', process.env.NODE_ENV);
    console.log('🔑 [ANALYZE API] API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('🔑 [ANALYZE API] API Key length:', process.env.OPENAI_API_KEY?.length);
    console.log('🔑 [ANALYZE API] API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

    // Validar prompt usando configuración
    if (!prompt || prompt.length < config.settings.analysis.minPromptLength) {
      console.log('❌ [ANALYZE API] Prompt muy corto:', prompt?.length);
      return NextResponse.json(
        { error: `El prompt debe tener al menos ${config.settings.analysis.minPromptLength} caracteres` },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu-api-key-aqui') {
      console.log('❌ [ANALYZE API] API key no configurada o es placeholder');
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada. Revisa tu archivo .env.local' },
        { status: 500 }
      );
    }

    // Inicializar OpenAI con configuración
    console.log('🤖 [ANALYZE API] Inicializando cliente OpenAI...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Construir prompt del sistema desde la configuración
    console.log('📋 [ANALYZE API] Construyendo prompt del sistema desde configuración...');
    const systemPrompt = config.systemPrompt.content;

    console.log('🤖 [ANALYZE API] Enviando prompt a OpenAI...');
    console.log('⚙️ [ANALYZE API] Configuración:', {
      model: config.settings.openai.model,
      temperature: config.settings.openai.temperature,
      maxTokens: config.settings.openai.maxTokens
    });

    const completion = await openai.chat.completions.create({
      model: config.settings.openai.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analiza este prompt creativo y responde ÚNICAMENTE con el JSON:\n\n"${prompt}"`
        }
      ],
      temperature: config.settings.openai.temperature,
      max_tokens: config.settings.openai.maxTokens,
    });

    console.log('✅ [ANALYZE API] Respuesta recibida de OpenAI');
    console.log('📊 [ANALYZE API] Usage:', completion.usage);
    
    const responseContent = completion.choices[0].message.content;
    console.log('📝 [ANALYZE API] Contenido completo de respuesta:');
    console.log('---START RESPONSE---');
    console.log(responseContent);
    console.log('---END RESPONSE---');
    
    if (!responseContent) {
      console.log('❌ [ANALYZE API] Sin contenido en respuesta');
      throw new Error('No se recibió respuesta de OpenAI');
    }

    // Limpiar respuesta: remover markdown y texto extra
    let cleanedResponse = responseContent.trim();
    
    // Remover bloques de código markdown si existen
    if (cleanedResponse.startsWith('```')) {
      const lines = cleanedResponse.split('\n');
      lines.shift(); // Remover primera línea ```json
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop(); // Remover última línea ```
      }
      cleanedResponse = lines.join('\n').trim();
    }

    console.log('🧹 [ANALYZE API] Respuesta limpiada:');
    console.log('---START CLEANED---');
    console.log(cleanedResponse);
    console.log('---END CLEANED---');

    // Intentar parsear el JSON con mejor manejo de errores
    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanedResponse);
      console.log('✅ [ANALYZE API] JSON parseado exitosamente');
    } catch (parseError: any) {
      console.log('❌ [ANALYZE API] Error parseando JSON:', parseError.message);
      console.log('🔍 [ANALYZE API] Contenido que falló:', cleanedResponse.substring(0, 200) + '...');
      
      // Intentar extraer JSON de respuesta más compleja
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
          console.log('✅ [ANALYZE API] JSON extraído y parseado exitosamente');
        } catch (secondError) {
          console.log('❌ [ANALYZE API] Segundo intento de parsing falló');
          throw new Error(`Respuesta de OpenAI no contiene JSON válido: ${parseError.message}`);
        }
      } else {
        throw new Error(`No se encontró JSON en la respuesta de OpenAI: ${parseError.message}`);
      }
    }

    // Validar y normalizar resultado usando configuración
    const validatedResult = validateAnalysisResult(analysisResult, config);

    console.log('✅ [ANALYZE API] Análisis completado exitosamente');

    return NextResponse.json({
      success: true,
      analysis: validatedResult,
      timestamp: new Date().toISOString(),
      config: {
        model: config.settings.openai.model,
        dimensionsCount: config.dimensions.length
      }
    });

  } catch (error: any) {
    console.error('💥 [ANALYZE API] Error completo:', error);
    console.error('📍 [ANALYZE API] Stack trace:', error.stack);
    
    if (error.code === 'insufficient_quota') {
      console.log('💳 [ANALYZE API] Límite de cuota alcanzado');
      return NextResponse.json(
        { error: 'Límite de API de OpenAI alcanzado. Intenta más tarde.' },
        { status: 429 }
      );
    }

    if (error.code === 'invalid_api_key') {
      console.log('🔑 [ANALYZE API] API key inválida');
      return NextResponse.json(
        { error: 'API key de OpenAI inválida. Verifica tu configuración.' },
        { status: 401 }
      );
    }

    if (error.message?.includes('JSON')) {
      console.log('🔧 [ANALYZE API] Error de parsing JSON');
      return NextResponse.json(
        { 
          error: 'Error procesando la respuesta de IA. La respuesta no tiene el formato esperado.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    if (error.message?.includes('configuración')) {
      console.log('📋 [ANALYZE API] Error de configuración');
      return NextResponse.json(
        { 
          error: 'Error en la configuración del sistema. Contacta al administrador.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    console.log('🚨 [ANALYZE API] Error genérico');
    return NextResponse.json(
      { 
        error: 'Error interno del servidor. Intenta nuevamente.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 