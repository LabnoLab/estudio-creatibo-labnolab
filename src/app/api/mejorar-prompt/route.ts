import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPrompt, getSystemPrompt } from '../../../lib/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageContext, tags } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ 
        error: 'Prompt es requerido y debe ser texto' 
      }, { status: 400 });
    }

    // Construir contexto adicional
    const contextInfo = [];
    if (imageContext) contextInfo.push(`Contexto de la imagen: ${imageContext}`);
    if (tags && tags.length > 0) contextInfo.push(`Tags relacionados: ${tags.join(', ')}`);
    
    const contextText = contextInfo.length > 0 ? `\n\nContexto adicional:\n${contextInfo.join('\n')}` : '';

    // Cargar prompts desde el archivo JSON
    const systemPrompt = await getPrompt('referencias', 'mejorar_prompt');
    
    const userPrompt = `Mejora este prompt creativo:

"${prompt}"${contextText}

Devuelve una versión mejorada que sea más específica, detallada y efectiva para generar arte con IA:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const improvedPrompt = completion.choices[0]?.message?.content?.trim();
    
    if (!improvedPrompt) {
      return NextResponse.json({ 
        error: 'No se pudo generar una mejora del prompt' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      originalPrompt: prompt,
      improvedPrompt: improvedPrompt,
      success: true 
    });

  } catch (error) {
    console.error('Error improving prompt:', error);
    
    // Manejo de errores específicos de OpenAI
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          error: 'Error de configuración de API. Verifica la API key de OpenAI.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json({ 
          error: 'Cuota de API excedida. Intenta más tarde.' 
        }, { status: 429 });
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ 
          error: 'Límite de velocidad alcanzado. Espera un momento e intenta de nuevo.' 
        }, { status: 429 });
      }
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor al mejorar el prompt' 
    }, { status: 500 });
  }
} 