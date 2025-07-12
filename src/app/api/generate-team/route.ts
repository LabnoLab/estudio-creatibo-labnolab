import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPrompt } from '../../../lib/prompts';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TeamMember {
  name: string;
  dimension: string;
  label: string;
  description: string;
  prompt_ready_to_use: string;
  emoji: string;
}

export async function POST(request: NextRequest) {
  console.log('🤖 [TEAM API] Iniciando generación de equipo ideal de IA...');
  
  try {
    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('🚨 [TEAM API] API key de OpenAI no configurada');
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada' },
        { status: 500 }
      );
    }

    // Parsear request body
    const { dimensions, originalPrompt } = await request.json();
    
    console.log('📝 [TEAM API] Original prompt length:', originalPrompt?.length || 0);
    console.log('📊 [TEAM API] Dimensions received:', Object.keys(dimensions || {}).length);

    // Validar inputs
    if (!dimensions || typeof dimensions !== 'object') {
      return NextResponse.json(
        { error: 'Dimensiones requeridas' },
        { status: 400 }
      );
    }

    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt original requerido' },
        { status: 400 }
      );
    }

    // Identificar las 3 dimensiones más bajas
    const lowestDimensions = getLowestDimensions(dimensions);
    console.log('📉 [TEAM API] Dimensiones más bajas identificadas:', lowestDimensions.map(d => `${d.label}: ${d.percentage}%`));

    // Cargar prompt base del sistema desde JSON
    const baseSystemPrompt = await getPrompt('teambuilding', 'analizar');
    
    // Crear prompt del sistema para generar equipo
    const systemPrompt = `${baseSystemPrompt}

Tu tarea específica es crear 3 asistentes de IA personalizados que ayuden al usuario a fortalecer sus dimensiones más débiles.

DIMENSIONES A COMPLEMENTAR:
${lowestDimensions.map((d, i) => `${i + 1}. ${d.label} (${d.percentage}%): ${getDimensionDescription(d.name)}`).join('\n')}

CONTEXTO DEL USUARIO:
El usuario escribió este prompt: "${originalPrompt}"

INSTRUCCIONES PARA CADA ASISTENTE:
1. Crear un nombre atractivo y memorable (ej: "Ana la Arquitecta", "Carlos el Conector")
2. Descripción clara de cómo complementa al usuario
3. Prompt listo para usar en ChatGPT/Claude que defina la personalidad y expertise del asistente
4. El prompt debe ser específico, detallado y inmediatamente útil

FORMATO DE RESPUESTA (JSON):
Responde con un array de 3 objetos con esta estructura exacta:
[
  {
    "name": "Nombre Atractivo del Asistente",
    "dimension": "nombre_dimension",
    "label": "Etiqueta Humana de la Dimensión",
    "description": "Descripción de 1-2 líneas sobre cómo este asistente complementa al usuario",
    "prompt_ready_to_use": "Prompt completo y detallado listo para copiar y usar en ChatGPT/Claude",
    "emoji": "🎯"
  }
]

IMPORTANTE: 
- Responde ÚNICAMENTE con el JSON válido, sin texto adicional ni formato markdown
- Los prompts deben ser específicos y inmediatamente útiles
- Cada asistente debe tener una personalidad única y expertise clara
- Los nombres deben ser memorables y reflejar la dimensión`;

    console.log('🤖 [TEAM API] Enviando prompt a OpenAI...');
    
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
          content: `Genera mi equipo ideal de IA basado en mis dimensiones más bajas y mi prompt original.`
        }
      ],
      temperature: 0.9, // Alta creatividad para nombres y personalidades únicas
      max_tokens: 1500,
    });

    console.log('✅ [TEAM API] Respuesta recibida de OpenAI');
    console.log('📊 [TEAM API] Usage:', completion.usage);

    const rawResponse = completion.choices[0]?.message?.content?.trim();

    if (!rawResponse) {
      throw new Error('No se pudo generar el equipo de IA');
    }

    console.log('📝 [TEAM API] Respuesta completa:');
    console.log('---START RESPONSE---');
    console.log(rawResponse);
    console.log('---END RESPONSE---');

    // Limpiar y parsear respuesta
    const cleanedResponse = cleanResponse(rawResponse);
    console.log('🧹 [TEAM API] Respuesta limpiada:', cleanedResponse.substring(0, 200) + '...');

    let teamMembers: TeamMember[];
    try {
      teamMembers = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('💥 [TEAM API] Error parseando JSON:', parseError);
      throw new Error('Error procesando la respuesta de OpenAI');
    }

    // Validar estructura de respuesta
    if (!Array.isArray(teamMembers) || teamMembers.length !== 3) {
      throw new Error('Formato de respuesta inválido - se esperaban 3 asistentes');
    }

    // Validar cada miembro del equipo
    for (const member of teamMembers) {
      if (!member.name || !member.dimension || !member.label || !member.description || !member.prompt_ready_to_use) {
        throw new Error('Asistente incompleto recibido');
      }
    }

    console.log('📊 [TEAM API] Asistentes generados:', teamMembers.length);
    console.log('👥 [TEAM API] Nombres:', teamMembers.map(m => m.name));
    console.log('✅ [TEAM API] Generación completada exitosamente');

    return NextResponse.json({
      success: true,
      teamMembers,
      originalPrompt,
      lowestDimensions: lowestDimensions.map(d => d.label),
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('💥 [TEAM API] Error:', error);
    
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

// Función para obtener las 3 dimensiones más bajas
function getLowestDimensions(dimensions: Record<string, number>): Array<{
  name: string;
  label: string;
  percentage: number;
}> {
  const dimensionLabels = getDimensionLabels();
  
  const dimensionArray = Object.entries(dimensions).map(([name, percentage]) => ({
    name,
    label: dimensionLabels[name] || name,
    percentage
  }));

  // Ordenar por porcentaje ascendente y tomar los 3 más bajos
  return dimensionArray
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);
}

// Función para obtener las etiquetas de las dimensiones
function getDimensionLabels(): Record<string, string> {
  return {
    'arquitecto_sistemas': 'Arquitecto/a de Sistemas',
    'obsesion_ux': 'Obsesión UX',
    'hacker_procesos': 'Hacker de Procesos',
    'vision_panoramica': 'Visión Panorámica',
    'data_lover': 'Data Lover',
    'detector_futuros': 'Detector de Futuros',
    'diseñador_experiencias': 'Diseñador/a de Experiencias',
    'constructor_comunidades': 'Constructor/a de Comunidades',
    'transformador_cultural': 'Transformador/a Cultural',
    'storyteller_natural': 'Storyteller Natural',
    'experimentador_serial': 'Experimentador/a Serial',
    'conectador_mundos': 'Conectador/a de Mundos'
  };
}

// Función para obtener descripciones de las dimensiones
function getDimensionDescription(dimensionName: string): string {
  const descriptions: Record<string, string> = {
    'arquitecto_sistemas': 'Diseña estructuras técnicas robustas, piensa en escalabilidad, integración y arquitectura de soluciones.',
    'obsesion_ux': 'Se enfoca obsesivamente en la experiencia del usuario, usabilidad, interfaces intuitivas y diseño centrado en el usuario.',
    'hacker_procesos': 'Optimiza y hackea workflows, automatiza tareas, encuentra formas disruptivas de hacer las cosas más eficientes.',
    'vision_panoramica': 'Ve el big picture, conecta puntos distantes, piensa estratégicamente considerando ecosistemas completos.',
    'data_lover': 'Se basa en métricas, analytics, KPIs, insights basados en datos y análisis cuantitativos para tomar decisiones.',
    'detector_futuros': 'Identifica tendencias emergentes, anticipa cambios, busca oportunidades futuras y detecta señales débiles.',
    'diseñador_experiencias': 'Crea experiencias memorables, se enfoca en emociones, momentos mágicos y conexiones humanas profundas.',
    'constructor_comunidades': 'Construye redes, facilita colaboración, conecta personas, crea engagement y desarrolla comunidades.',
    'transformador_cultural': 'Impulsa cambios organizacionales, crea nuevas narrativas, transforma mentalidades y culturas.',
    'storyteller_natural': 'Comunica de forma compelling, crea narrativas poderosas, conecta emocionalmente con audiencias.',
    'experimentador_serial': 'Prueba constantemente, hace prototipos rápidos, experimenta con nuevos enfoques y métodos.',
    'conectador_mundos': 'Une diferentes industrias, disciplinas y perspectivas, encuentra sinergias entre mundos aparentemente distintos.'
  };
  
  return descriptions[dimensionName] || 'Dimensión especializada en el área correspondiente.';
} 