import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPrompt } from '../../../lib/prompts';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PerspectiveResult {
  dimension: string;
  label: string;
  rewritten_prompt: string;
  insight: string;
}

export async function POST(request: NextRequest) {
  console.log('🌈 [PERSPECTIVES API] Iniciando generación de otras perspectivas...');
  
  try {
    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('🚨 [PERSPECTIVES API] API key de OpenAI no configurada');
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada' },
        { status: 500 }
      );
    }

    // Parsear request body
    const { originalPrompt, dominantDimension } = await request.json();
    
    console.log('📝 [PERSPECTIVES API] Original prompt length:', originalPrompt?.length || 0);
    console.log('🎯 [PERSPECTIVES API] Dominant dimension:', dominantDimension?.name || 'No especificada');

    // Validar inputs
    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt original requerido' },
        { status: 400 }
      );
    }

    if (!dominantDimension || !dominantDimension.name) {
      return NextResponse.json(
        { error: 'Dimensión dominante requerida' },
        { status: 400 }
      );
    }

    // Seleccionar perspectivas complementarias
    const complementaryPerspectives = selectComplementaryPerspectives(dominantDimension.name);
    console.log('🔄 [PERSPECTIVES API] Perspectivas seleccionadas:', complementaryPerspectives.map(p => p.label));

    // Cargar prompt del sistema desde JSON
    const baseSystemPrompt = await getPrompt('teambuilding', 'otras_perspectivas');
    
    // Crear prompt del sistema para generar perspectivas
    const systemPrompt = `${baseSystemPrompt}

Tu tarea es reescribir el prompt del usuario desde ${complementaryPerspectives.length} perspectivas específicas, manteniendo la esencia original pero añadiendo el enfoque único de cada perfil.

PERSPECTIVAS A GENERAR:
${complementaryPerspectives.map((p, i) => `${i + 1}. ${p.label}: ${p.characteristics}`).join('\n')}

INSTRUCCIONES:
1. Para cada perspectiva, reescribe el prompt manteniendo la intención original
2. Añade el vocabulario, estilo y enfoque característico de cada perfil
3. Haz que cada versión sea única y auténtica a esa perspectiva
4. Incluye un insight valioso sobre por qué esta perspectiva es importante
5. Mantén un tono profesional pero inspirador

FORMATO DE RESPUESTA (JSON):
Responde con un array de objetos con esta estructura exacta:
[
  {
    "dimension": "nombre_dimension",
    "label": "Etiqueta Humana",
    "rewritten_prompt": "El prompt reescrito desde esta perspectiva",
    "insight": "Una explicación de por qué esta perspectiva aporta valor único al proyecto"
  }
]

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional ni formato markdown.`;

    console.log('🤖 [PERSPECTIVES API] Enviando prompt a OpenAI...');
    
    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: originalPrompt
        }
      ],
      temperature: 0.8, // Más creatividad para perspectivas diversas
      max_tokens: 1200,
    });

    console.log('✅ [PERSPECTIVES API] Respuesta recibida de OpenAI');
    console.log('📊 [PERSPECTIVES API] Usage:', completion.usage);

    const rawResponse = completion.choices[0]?.message?.content?.trim();

    if (!rawResponse) {
      throw new Error('No se pudieron generar las perspectivas');
    }

    console.log('📝 [PERSPECTIVES API] Respuesta completa:');
    console.log('---START RESPONSE---');
    console.log(rawResponse);
    console.log('---END RESPONSE---');

    // Limpiar y parsear respuesta
    const cleanedResponse = cleanResponse(rawResponse);
    console.log('🧹 [PERSPECTIVES API] Respuesta limpiada:', cleanedResponse);

    let perspectives: PerspectiveResult[];
    try {
      perspectives = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('💥 [PERSPECTIVES API] Error parseando JSON:', parseError);
      throw new Error('Error procesando la respuesta de OpenAI');
    }

    // Validar estructura de respuesta
    if (!Array.isArray(perspectives) || perspectives.length === 0) {
      throw new Error('Formato de respuesta inválido');
    }

    // Validar cada perspectiva
    for (const perspective of perspectives) {
      if (!perspective.dimension || !perspective.label || !perspective.rewritten_prompt || !perspective.insight) {
        throw new Error('Perspectiva incompleta recibida');
      }
    }

    console.log('📊 [PERSPECTIVES API] Perspectivas generadas:', perspectives.length);
    console.log('✅ [PERSPECTIVES API] Generación completada exitosamente');

    return NextResponse.json({
      success: true,
      perspectives,
      originalPrompt,
      dominantDimension: dominantDimension.label,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('💥 [PERSPECTIVES API] Error:', error);
    
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
  const jsonStart = cleaned.indexOf('[');
  const jsonEnd = cleaned.lastIndexOf(']') + 1;
  
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd);
  }
  
  return cleaned.trim();
}

// Función para seleccionar perspectivas complementarias basadas en la dimensión dominante
function selectComplementaryPerspectives(dominantDimension: string): Array<{
  name: string;
  label: string;
  characteristics: string;
}> {
  const allPerspectives = {
    'arquitecto_sistemas': {
      name: 'arquitecto_sistemas',
      label: 'Arquitecto/a de Sistemas',
      characteristics: 'Piensa en estructuras, escalabilidad, integración de componentes, arquitectura técnica, sistemas robustos, APIs, infraestructura y soluciones técnicas elegantes.'
    },
    'obsesion_ux': {
      name: 'obsesion_ux',
      label: 'Obsesión UX',
      characteristics: 'Se enfoca en la experiencia del usuario, usabilidad, interfaces intuitivas, journey del usuario, accesibilidad, diseño centrado en el usuario y simplicidad.'
    },
    'hacker_procesos': {
      name: 'hacker_procesos',
      label: 'Hacker de Procesos',
      characteristics: 'Optimiza workflows, automatiza tareas, encuentra formas disruptivas de hacer las cosas, hackea procesos existentes, busca eficiencia y transformación.'
    },
    'vision_panoramica': {
      name: 'vision_panoramica',
      label: 'Visión Panorámica',
      characteristics: 'Ve el big picture, conecta puntos distantes, piensa estratégicamente, considera ecosistemas completos, busca sinergias e interdependencias.'
    },
    'data_lover': {
      name: 'data_lover',
      label: 'Data Lover',
      characteristics: 'Se basa en métricas, analytics, KPIs, datos cuantitativos, insights basados en números, tracking, medición y análisis estadístico.'
    },
    'detector_futuros': {
      name: 'detector_futuros',
      label: 'Detector de Futuros',
      characteristics: 'Identifica tendencias emergentes, anticipa cambios, busca oportunidades futuras, innova, detecta señales débiles y piensa en evolución.'
    },
    'diseñador_experiencias': {
      name: 'diseñador_experiencias',
      label: 'Diseñador/a de Experiencias',
      characteristics: 'Crea experiencias memorables, se enfoca en emociones, momentos mágicos, journey completo, sensaciones y conexiones humanas.'
    },
    'constructor_comunidades': {
      name: 'constructor_comunidades',
      label: 'Constructor/a de Comunidades',
      characteristics: 'Construye redes, facilita colaboración, conecta personas, crea engagement, fomenta participación y desarrolla comunidades.'
    },
    'transformador_cultural': {
      name: 'transformador_cultural',
      label: 'Transformador/a Cultural',
      characteristics: 'Impulsa cambios culturales, desafía status quo, evoluciona mentalidades, transforma hábitos, crea nuevas narrativas y dinámicas.'
    },
    'storyteller_natural': {
      name: 'storyteller_natural',
      label: 'Storyteller Natural',
      characteristics: 'Comunica a través de historias, crea narrativas poderosas, conecta emocionalmente, genera engagement y usa el poder del storytelling.'
    },
    'experimentador_serial': {
      name: 'experimentador_serial',
      label: 'Experimentador/a Serial',
      characteristics: 'Prueba constantemente, itera rápido, valida hipótesis, aprende haciendo, falla rápido, prototipa y experimenta sistemáticamente.'
    },
    'conectador_mundos': {
      name: 'conectador_mundos',
      label: 'Conectador/a de Mundos',
      characteristics: 'Une disciplinas diferentes, encuentra intersecciones inesperadas, combina perspectivas diversas, crea fusiones innovadoras y conexiones únicas.'
    }
  };

  // Lógica para seleccionar perspectivas complementarias
  const complementaryMap: Record<string, string[]> = {
    // Técnicas -> Humanas/Creativas
    'arquitecto_sistemas': ['diseñador_experiencias', 'storyteller_natural', 'constructor_comunidades'],
    'data_lover': ['diseñador_experiencias', 'transformador_cultural', 'storyteller_natural'],
    'hacker_procesos': ['constructor_comunidades', 'transformador_cultural', 'diseñador_experiencias'],

    // Estratégicas -> Creativas/Experimentales
    'vision_panoramica': ['storyteller_natural', 'experimentador_serial', 'conectador_mundos'],
    'detector_futuros': ['diseñador_experiencias', 'experimentador_serial', 'storyteller_natural'],

    // Experiencia -> Técnicas/Analíticas
    'obsesion_ux': ['arquitecto_sistemas', 'data_lover', 'hacker_procesos'],
    'diseñador_experiencias': ['data_lover', 'arquitecto_sistemas', 'vision_panoramica'],

    // Sociales -> Técnicas/Analíticas
    'constructor_comunidades': ['arquitecto_sistemas', 'data_lover', 'hacker_procesos'],
    'transformador_cultural': ['data_lover', 'arquitecto_sistemas', 'experimentador_serial'],

    // Creativas -> Técnicas/Estratégicas
    'storyteller_natural': ['arquitecto_sistemas', 'data_lover', 'vision_panoramica'],
    'conectador_mundos': ['arquitecto_sistemas', 'data_lover', 'hacker_procesos'],

    // Experimentales -> Estratégicas/Analíticas
    'experimentador_serial': ['vision_panoramica', 'data_lover', 'arquitecto_sistemas']
  };

  const selectedDimensions = complementaryMap[dominantDimension] || ['diseñador_experiencias', 'data_lover', 'storyteller_natural'];
  
  // Tomar las primeras 2-3 perspectivas (máximo 3)
  const finalSelection = selectedDimensions.slice(0, 3);
  
  return finalSelection.map(dim => allPerspectives[dim as keyof typeof allPerspectives]);
} 