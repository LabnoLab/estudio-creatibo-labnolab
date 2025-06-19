import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Definir las dimensiones esperadas para validación
const EXPECTED_DIMENSIONS = [
  'arquitecto_sistemas',
  'obsesion_ux', 
  'hacker_procesos',
  'vision_panoramica',
  'data_lover',
  'detector_futuros',
  'diseñador_experiencias',
  'constructor_comunidades',
  'transformador_cultural',
  'storyteller_natural',
  'experimentador_serial',
  'conectador_mundos'
];

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    console.log('🚀 [ANALYZE API] Iniciando análisis...');
    console.log('📝 [ANALYZE API] Prompt length:', prompt?.length);
    
    // Debug de variables de entorno
    console.log('🔍 [ANALYZE API] Debugging API Key...');
    console.log('📊 [ANALYZE API] NODE_ENV:', process.env.NODE_ENV);
    console.log('🔑 [ANALYZE API] API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('🔑 [ANALYZE API] API Key length:', process.env.OPENAI_API_KEY?.length);
    console.log('🔑 [ANALYZE API] API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

    if (!prompt || prompt.length < 50) {
      console.log('❌ [ANALYZE API] Prompt muy corto:', prompt?.length);
      return NextResponse.json(
        { error: 'El prompt debe tener al menos 50 caracteres' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'tu-api-key-aqui') {
      console.log('❌ [ANALYZE API] API key no configurada o es placeholder');
      console.log('🔍 [ANALYZE API] Current value:', process.env.OPENAI_API_KEY);
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada. Revisa tu archivo .env.local' },
        { status: 500 }
      );
    }

    // Inicializar OpenAI dentro del handler
    console.log('🤖 [ANALYZE API] Inicializando cliente OpenAI...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `Eres un experto analista de perfiles creativos de LabnoLab. 

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido. No incluyas explicaciones adicionales, texto antes o después del JSON, ni markdown. Solo el JSON.

Analiza el texto según estas 12 dimensiones creativas de LabnoLab:

1. **arquitecto_sistemas** - Habilidad para diseñar y estructurar sistemas complejos, pensar en arquitecturas y frameworks
2. **obsesion_ux** - Enfoque intenso en la experiencia del usuario, usabilidad y diseño centrado en las personas
3. **hacker_procesos** - Capacidad para optimizar, automatizar y mejorar procesos existentes de forma creativa
4. **vision_panoramica** - Habilidad para ver el panorama general, conectar contextos amplios y pensar estratégicamente
5. **data_lover** - Pasión por los datos, análisis, métricas y toma de decisiones basada en información
6. **detector_futuros** - Capacidad para anticipar tendencias, identificar oportunidades emergentes y pensar en escenarios futuros
7. **diseñador_experiencias** - Habilidad para crear y diseñar experiencias memorables e impactantes
8. **constructor_comunidades** - Talento para crear, nutrir y hacer crecer comunidades y ecosistemas colaborativos
9. **transformador_cultural** - Capacidad para generar cambios culturales y transformar mentalidades
10. **storyteller_natural** - Habilidad excepcional para contar historias, comunicar ideas y crear narrativas envolventes
11. **experimentador_serial** - Tendencia a experimentar constantemente, probar nuevas ideas y iterar rápidamente
12. **conectador_mundos** - Habilidad para conectar diferentes sectores, disciplinas y crear puentes entre mundos diversos

FORMATO EXACTO REQUERIDO (copia exactamente esta estructura):
{
  "dimensions": {
    "arquitecto_sistemas": 75,
    "obsesion_ux": 45,
    "hacker_procesos": 60,
    "vision_panoramica": 80,
    "data_lover": 30,
    "detector_futuros": 70,
    "diseñador_experiencias": 55,
    "constructor_comunidades": 40,
    "transformador_cultural": 65,
    "storyteller_natural": 85,
    "experimentador_serial": 50,
    "conectador_mundos": 45
  },
  "topDimensions": [
    {
      "name": "storyteller_natural",
      "label": "Storyteller Natural",
      "percentage": 85,
      "reasoning": "El texto demuestra narrativa excepcional con estructura clara y elementos envolventes"
    },
    {
      "name": "vision_panoramica",
      "label": "Visión Panorámica", 
      "percentage": 80,
      "reasoning": "Muestra capacidad para conectar múltiples contextos y pensar estratégicamente"
    }
  ]
}

INSTRUCCIONES:
- Asigna porcentajes (0-100) según evidencia en el texto
- Identifica 2-4 dimensiones principales (generalmente 60%+)
- Cada dimensión se evalúa independientemente
- Responde SOLO con el JSON, sin texto adicional`;

    console.log('🤖 [ANALYZE API] Enviando prompt a OpenAI...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      temperature: 0.1, // Reducido para más consistencia
      max_tokens: 1200,
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

    // Validar estructura básica
    if (!analysisResult || typeof analysisResult !== 'object') {
      console.log('❌ [ANALYZE API] Resultado no es un objeto válido');
      throw new Error('Formato de respuesta incorrecto: no es un objeto');
    }

    if (!analysisResult.dimensions || typeof analysisResult.dimensions !== 'object') {
      console.log('❌ [ANALYZE API] Falta objeto dimensions');
      throw new Error('Formato de respuesta incorrecto: falta dimensions');
    }

    if (!analysisResult.topDimensions || !Array.isArray(analysisResult.topDimensions)) {
      console.log('❌ [ANALYZE API] Falta array topDimensions');
      throw new Error('Formato de respuesta incorrecto: falta topDimensions');
    }

    // Validar que todas las dimensiones esperadas estén presentes
    const missingDimensions = EXPECTED_DIMENSIONS.filter(dim => 
      !(dim in analysisResult.dimensions) || 
      typeof analysisResult.dimensions[dim] !== 'number'
    );

    if (missingDimensions.length > 0) {
      console.log('⚠️ [ANALYZE API] Dimensiones faltantes:', missingDimensions);
      // Añadir dimensiones faltantes con valor por defecto
      missingDimensions.forEach(dim => {
        analysisResult.dimensions[dim] = 0;
      });
    }

    // Validar topDimensions
    if (analysisResult.topDimensions.length === 0) {
      console.log('⚠️ [ANALYZE API] No hay topDimensions, generando automáticamente');
      // Generar topDimensions desde dimensions si está vacío
      const sortedDimensions = Object.entries(analysisResult.dimensions)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([name, percentage]) => ({
          name,
          label: name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          percentage: percentage as number,
          reasoning: "Dimensión identificada automáticamente por el análisis"
        }));
      
      analysisResult.topDimensions = sortedDimensions;
    }

    console.log('✅ [ANALYZE API] Análisis completado exitosamente');
    console.log('📊 [ANALYZE API] Top dimensions:', analysisResult.topDimensions.length);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      timestamp: new Date().toISOString()
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