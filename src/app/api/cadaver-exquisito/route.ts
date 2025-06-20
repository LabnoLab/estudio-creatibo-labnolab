import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { loadAnalysisConfig, validateAnalysisResult } from '../analyze/route';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TeamPrompt {
  content: string;
  name?: string;
  role?: string;
}

interface CadaverExquisitoResult {
  prompt_hibrido: string;
  analisis_colectivo: {
    dimensions: Record<string, number>;
    topDimensions: Array<{
      name: string;
      label: string;
      percentage: number;
      reasoning: string;
    }>;
  };
  dinamicas_colaboracion: {
    estilos_detectados: string[];
    sinergias: string[];
    tensiones_creativas: string[];
    potencial_innovador: string;
  };
  prompts_originales: TeamPrompt[];
}

export async function POST(request: NextRequest) {
  console.log('🎭 [CADAVER API] Iniciando creación de cadáver exquisito...');
  
  try {
    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('🚨 [CADAVER API] API key de OpenAI no configurada');
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada' },
        { status: 500 }
      );
    }

    // Parsear request body
    const { prompts } = await request.json();
    
    console.log('📝 [CADAVER API] Prompts recibidos:', prompts?.length || 0);

    // Validar inputs
    if (!prompts || !Array.isArray(prompts) || prompts.length < 2 || prompts.length > 5) {
      return NextResponse.json(
        { error: 'Se requieren entre 2 y 5 prompts para crear el cadáver exquisito' },
        { status: 400 }
      );
    }

    // Validar que cada prompt tenga contenido
    for (let i = 0; i < prompts.length; i++) {
      if (!prompts[i].content || prompts[i].content.trim().length < 20) {
        return NextResponse.json(
          { error: `El prompt ${i + 1} debe tener al menos 20 caracteres` },
          { status: 400 }
        );
      }
    }

    console.log('🎨 [CADAVER API] Prompts validados correctamente');

    // Cargar configuración de análisis
    const config = await loadAnalysisConfig();
    console.log('📋 [CADAVER API] Configuración cargada exitosamente');

    // Crear prompt del sistema para el cadáver exquisito
    const cadaverSystemPrompt = `Eres un maestro del surrealismo y la colaboración creativa, experto en la técnica del "Cadáver Exquisito".

Tu tarea es crear un PROMPT HÍBRIDO fascinante combinando ${prompts.length} prompts diferentes de manera surrealista, manteniendo la esencia de cada uno pero creando algo completamente nuevo e inesperado.

PROMPTS DEL EQUIPO:
${prompts.map((p, i) => `${i + 1}. ${p.name ? `[${p.name}${p.role ? ` - ${p.role}` : ''}]: ` : ''}${p.content}`).join('\n\n')}

INSTRUCCIONES PARA EL CADÁVER EXQUISITO:
1. Identifica los elementos más interesantes y únicos de cada prompt
2. Combínalos de manera surrealista, creando conexiones inesperadas
3. Mantén la coherencia conceptual pero permite la experimentación radical
4. El resultado debe ser más rico y complejo que la suma de sus partes
5. Preserva la esencia creativa de cada contribución individual

TÉCNICAS SURREALISTAS A APLICAR:
- Yuxtaposición de conceptos aparentemente no relacionados
- Metamorfosis de ideas (una idea se transforma gradualmente en otra)
- Automatismo creativo (flujo libre de ideas)
- Sinestesia conceptual (mezclar diferentes tipos de percepciones/enfoques)
- Condensación simbólica (múltiples significados en una sola imagen/concepto)

FORMATO DE RESPUESTA (JSON):
{
  "prompt_hibrido": "El prompt resultante del cadáver exquisito, que debe ser fascinante y ejecutable",
  "proceso_creativo": "Explicación de cómo se combinaron los elementos y qué técnicas surrealistas se usaron",
  "elementos_preservados": ["Lista de elementos clave preservados de cada prompt original"],
  "innovaciones_emergentes": ["Nuevas ideas que surgieron de la combinación surrealista"]
}

IMPORTANTE: 
- El prompt híbrido debe ser coherente y ejecutable, no solo artístico
- Debe inspirar acción creativa, no solo contemplación
- Combina estilos de manera orgánica, no forzada
- Responde ÚNICAMENTE con el JSON válido, sin texto adicional`;

    console.log('🤖 [CADAVER API] Creando cadáver exquisito con OpenAI...');
    
    // Crear el cadáver exquisito
    const cadaverCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: cadaverSystemPrompt
        },
        {
          role: 'user',
          content: `Crea un cadáver exquisito fascinante combinando estos ${prompts.length} prompts de manera surrealista.`
        }
      ],
      temperature: 0.8, // Alta creatividad para el surrealismo
      max_tokens: 1000,
    });

    console.log('✅ [CADAVER API] Cadáver exquisito creado');
    console.log('📊 [CADAVER API] Usage (cadáver):', cadaverCompletion.usage);

    const cadaverResponse = cadaverCompletion.choices[0]?.message?.content?.trim();
    if (!cadaverResponse) {
      throw new Error('No se pudo crear el cadáver exquisito');
    }

    console.log('📝 [CADAVER API] Respuesta del cadáver:');
    console.log('---START CADAVER---');
    console.log(cadaverResponse);
    console.log('---END CADAVER---');

    // Parsear respuesta del cadáver exquisito
    const cleanedCadaverResponse = cleanResponse(cadaverResponse);
    let cadaverData;
    try {
      cadaverData = JSON.parse(cleanedCadaverResponse);
    } catch (parseError) {
      console.error('💥 [CADAVER API] Error parseando cadáver:', parseError);
      throw new Error('Error procesando el cadáver exquisito');
    }

    const promptHibrido = cadaverData.prompt_hibrido;
    console.log('🎭 [CADAVER API] Prompt híbrido creado, length:', promptHibrido.length);

    // Analizar el prompt híbrido usando la configuración existente
    console.log('📊 [CADAVER API] Analizando prompt híbrido...');
    
    const analysisCompletion = await openai.chat.completions.create({
      model: config.settings.openai.model,
      messages: [
        {
          role: 'system',
          content: config.systemPrompt.content
        },
        {
          role: 'user',
          content: promptHibrido
        }
      ],
      temperature: config.settings.openai.temperature,
      max_tokens: config.settings.openai.maxTokens,
    });

    console.log('✅ [CADAVER API] Análisis del híbrido completado');
    console.log('📊 [CADAVER API] Usage (análisis):', analysisCompletion.usage);

    const analysisResponse = analysisCompletion.choices[0]?.message?.content?.trim();
    if (!analysisResponse) {
      throw new Error('No se pudo analizar el prompt híbrido');
    }

    // Procesar análisis del híbrido
    const cleanedAnalysis = cleanResponse(analysisResponse);
    let analysisResult;
    try {
      analysisResult = JSON.parse(cleanedAnalysis);
    } catch (parseError) {
      console.error('💥 [CADAVER API] Error parseando análisis:', parseError);
      throw new Error('Error procesando el análisis del híbrido');
    }

    // Validar resultado del análisis
    const validatedResult = await validateAnalysisResult(analysisResult, config);

    // Crear análisis de dinámicas colaborativas
    console.log('🤝 [CADAVER API] Analizando dinámicas de colaboración...');
    
    const dinamicasSystemPrompt = `Eres un experto en dinámicas de equipo y colaboración creativa.

Analiza estos prompts originales y el resultado híbrido para identificar dinámicas de colaboración:

PROMPTS ORIGINALES:
${prompts.map((p, i) => `${i + 1}. ${p.name ? `[${p.name}${p.role ? ` - ${p.role}` : ''}]: ` : ''}${p.content}`).join('\n\n')}

PROMPT HÍBRIDO RESULTANTE:
${promptHibrido}

Responde con un JSON que contenga:
{
  "estilos_detectados": ["Lista de estilos creativos identificados en los prompts originales"],
  "sinergias": ["Elementos que se potencian mutuamente en la colaboración"],
  "tensiones_creativas": ["Diferencias productivas que generan innovación"],
  "potencial_innovador": "Evaluación del potencial innovador del equipo basado en la diversidad de enfoques"
}`;

    const dinamicasCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: dinamicasSystemPrompt
        },
        {
          role: 'user',
          content: 'Analiza las dinámicas de colaboración de este equipo.'
        }
      ],
      temperature: 0.3, // Más analítico para dinámicas
      max_tokens: 800,
    });

    console.log('✅ [CADAVER API] Dinámicas de colaboración analizadas');
    console.log('📊 [CADAVER API] Usage (dinámicas):', dinamicasCompletion.usage);

    const dinamicasResponse = dinamicasCompletion.choices[0]?.message?.content?.trim();
    const cleanedDinamicas = cleanResponse(dinamicasResponse);
    let dinamicasData;
    try {
      dinamicasData = JSON.parse(cleanedDinamicas);
    } catch (parseError) {
      console.error('💥 [CADAVER API] Error parseando dinámicas:', parseError);
      // Fallback para dinámicas
      dinamicasData = {
        estilos_detectados: ["Diversos estilos creativos detectados"],
        sinergias: ["Complementariedad de enfoques"],
        tensiones_creativas: ["Diversidad de perspectivas"],
        potencial_innovador: "Alto potencial debido a la diversidad de enfoques creativos"
      };
    }

    // Construir respuesta final
    const result: CadaverExquisitoResult = {
      prompt_hibrido: promptHibrido,
      analisis_colectivo: {
        dimensions: validatedResult.dimensions,
        topDimensions: validatedResult.topDimensions
      },
      dinamicas_colaboracion: dinamicasData,
      prompts_originales: prompts
    };

    console.log('🎭 [CADAVER API] Cadáver exquisito completado exitosamente');
    console.log('📊 [CADAVER API] Prompts procesados:', prompts.length);
    console.log('🎨 [CADAVER API] Prompt híbrido length:', promptHibrido.length);
    console.log('📈 [CADAVER API] Top dimensions:', validatedResult.topDimensions.length);

    return NextResponse.json({
      success: true,
      ...result,
      proceso_creativo: cadaverData.proceso_creativo,
      elementos_preservados: cadaverData.elementos_preservados,
      innovaciones_emergentes: cadaverData.innovaciones_emergentes,
      usage: {
        cadaver: cadaverCompletion.usage,
        analysis: analysisCompletion.usage,
        dinamicas: dinamicasCompletion.usage
      }
    });

  } catch (error: any) {
    console.error('💥 [CADAVER API] Error:', error);
    
    // Manejo específico de errores de OpenAI
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Cuota de OpenAI agotada. Intenta más tarde.' },
        { status: 429 }
      );
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'API key de OpenAI inválida' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para limpiar la respuesta de OpenAI
function cleanResponse(response: string): string {
  // Remover markdown si existe
  let cleaned = response.replace(/```json\s*|\s*```/g, '');
  
  // Remover texto adicional antes y después del JSON
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}') + 1;
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd);
  }
  
  return cleaned.trim();
} 