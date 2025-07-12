import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPrompt } from '../../../lib/prompts';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('🎨 [IMPROVE API] Iniciando mejora de prompt...');
  
  try {
    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('🚨 [IMPROVE API] API key de OpenAI no configurada');
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada' },
        { status: 500 }
      );
    }

    // Parsear request body
    const { originalPrompt, dominantDimension } = await request.json();
    
    console.log('📝 [IMPROVE API] Original prompt length:', originalPrompt?.length || 0);
    console.log('🎯 [IMPROVE API] Dominant dimension:', dominantDimension?.label || 'No especificada');

    // Validar inputs
    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt original requerido' },
        { status: 400 }
      );
    }

    if (!dominantDimension || !dominantDimension.label) {
      return NextResponse.json(
        { error: 'Dimensión dominante requerida' },
        { status: 400 }
      );
    }

    // Cargar prompt del sistema desde JSON
    const baseSystemPrompt = await getPrompt('teambuilding', 'mejorar_desde_dimension');
    
    // Crear prompt del sistema personalizado para esta dimensión
    const systemPrompt = `${baseSystemPrompt}

Tu tarea es reescribir el prompt del usuario desde la perspectiva de un "${dominantDimension.label}".

CARACTERÍSTICAS DEL ${dominantDimension.label.toUpperCase()}:
${getDimensionCharacteristics(dominantDimension.name)}

INSTRUCCIONES:
1. Mantén la esencia e intención original del prompt
2. Añade el estilo, vocabulario y enfoque característico de un ${dominantDimension.label}
3. Incorpora elementos específicos de esta dimensión creativa
4. Haz el prompt más rico y específico sin cambiar su objetivo principal
5. Usa un tono profesional pero inspirador
6. El resultado debe ser un prompt mejorado listo para usar

FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con el prompt mejorado, sin explicaciones adicionales ni formato markdown.`;

    console.log('🤖 [IMPROVE API] Enviando prompt a OpenAI...');
    
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
      temperature: 0.7, // Un poco más creativo para mejoras
      max_tokens: 800,
    });

    console.log('✅ [IMPROVE API] Respuesta recibida de OpenAI');
    console.log('📊 [IMPROVE API] Usage:', completion.usage);

    const improvedPrompt = completion.choices[0]?.message?.content?.trim();

    if (!improvedPrompt) {
      throw new Error('No se pudo generar el prompt mejorado');
    }

    console.log('📝 [IMPROVE API] Improved prompt length:', improvedPrompt.length);
    console.log('✅ [IMPROVE API] Mejora completada exitosamente');

    return NextResponse.json({
      success: true,
      improvedPrompt,
      originalPrompt,
      dominantDimension: dominantDimension.label,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('💥 [IMPROVE API] Error:', error);
    
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

// Función helper para obtener características de cada dimensión
function getDimensionCharacteristics(dimensionName: string): string {
  const characteristics: Record<string, string> = {
    'arquitecto_sistemas': 'Piensa en estructuras, escalabilidad, integración de componentes, arquitectura técnica, sistemas robustos, APIs, infraestructura y soluciones técnicas elegantes.',
    'obsesion_ux': 'Se enfoca en la experiencia del usuario, usabilidad, interfaces intuitivas, journey del usuario, accesibilidad, diseño centrado en el usuario y simplicidad.',
    'hacker_procesos': 'Optimiza workflows, automatiza tareas, encuentra formas disruptivas de hacer las cosas, hackea procesos existentes, busca eficiencia y transformación.',
    'vision_panoramica': 'Ve el big picture, conecta puntos distantes, piensa estratégicamente, considera ecosistemas completos, busca sinergias e interdependencias.',
    'data_lover': 'Se basa en métricas, analytics, KPIs, datos cuantitativos, insights basados en números, tracking, medición y análisis estadístico.',
    'detector_futuros': 'Identifica tendencias emergentes, anticipa cambios, busca oportunidades futuras, innova, detecta señales débiles y piensa en evolución.',
    'diseñador_experiencias': 'Crea experiencias memorables, se enfoca en emociones, momentos mágicos, journey completo, sensaciones y conexiones humanas.',
    'constructor_comunidades': 'Construye redes, facilita colaboración, conecta personas, crea engagement, fomenta participación y desarrolla comunidades.',
    'transformador_cultural': 'Impulsa cambios culturales, desafía status quo, evoluciona mentalidades, transforma hábitos, crea nuevas narrativas y dinámicas.',
    'storyteller_natural': 'Comunica a través de historias, crea narrativas poderosas, conecta emocionalmente, genera engagement y usa el poder del storytelling.',
    'experimentador_serial': 'Prueba constantemente, itera rápido, valida hipótesis, aprende haciendo, falla rápido, prototipa y experimenta sistemáticamente.',
    'conectador_mundos': 'Une disciplinas diferentes, encuentra intersecciones inesperadas, combina perspectivas diversas, crea fusiones innovadoras y conexiones únicas.'
  };

  return characteristics[dimensionName] || 'Enfoque creativo e innovador en la resolución de problemas.';
} 