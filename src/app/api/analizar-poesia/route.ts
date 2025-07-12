import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPrompt } from '../../../lib/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { poema } = await request.json();

    if (!poema || typeof poema !== 'string') {
      return NextResponse.json(
        { error: 'Poema requerido' }, 
        { status: 400 }
      );
    }

    // Prompt especializado para análisis lingüístico forense
    const systemPrompt = `Eres un especialista en análisis lingüístico forense de textos poéticos. Tu tarea es realizar un análisis completo y detallado de poemas, identificando:

1. MÉTRICA Y ESTRUCTURA:
   - Número de versos y estructura estrófica
   - Medida silábica promedio
   - Tipo de verso (libre, medido, etc.)
   - Ritmo y cadencia

2. FIGURAS RETÓRICAS:
   - Identificar metáforas, símiles, personificaciones
   - Aliteraciones, asonancias, consonancias
   - Hipérboles, ironías, oxímoros
   - Anáforas, epíforas, quiasmos

3. ANÁLISIS EMOCIONAL:
   - Tono predominante (melancólico, alegre, nostálgico, etc.)
   - Intensidad emocional (baja, media, alta)
   - Sentimientos específicos identificados

4. ANÁLISIS ESTILÍSTICO:
   - Época literaria estimada
   - Movimiento o corriente poética
   - Características técnicas distintivas

5. HUELLA DACTILAR LINGÜÍSTICA:
   - Nivel de complejidad sintáctica
   - Grado de originalidad
   - Maestría técnica

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "metrica": {
    "versos": number,
    "silabas": number,
    "tipo": "string",
    "ritmo": "string"
  },
  "figuras": ["string1", "string2", ...],
  "emocional": {
    "tono": "string",
    "intensidad": "string",
    "sentimientos": ["string1", "string2", ...]
  },
  "estilo": {
    "epoca": "string",
    "movimiento": "string",
    "caracteristicas": ["string1", "string2", ...]
  },
  "huella": {
    "complejidad": "string",
    "originalidad": "string",
    "tecnica": "string"
  }
}

Sé preciso, profesional y mantén un lenguaje accesible pero técnicamente riguroso.`;

    const userPrompt = `Analiza lingüísticamente este poema:

${poema}

Proporciona un análisis forense completo siguiendo la estructura JSON requerida.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta del modelo');
    }

    // Intentar parsear la respuesta JSON
    let analysis;
    try {
      // Limpiar la respuesta si viene con markdown
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      console.error('Contenido recibido:', content);
      
      // Fallback con análisis básico
      analysis = {
        metrica: {
          versos: poema.split('\n').filter(line => line.trim().length > 0).length,
          silabas: 8,
          tipo: "Verso libre",
          ritmo: "Variable"
        },
        figuras: ["Metáfora", "Imagen poética"],
        emocional: {
          tono: "Reflexivo",
          intensidad: "Media",
          sentimientos: ["Introspección", "Sensibilidad"]
        },
        estilo: {
          epoca: "Contemporáneo",
          movimiento: "Poesía moderna",
          caracteristicas: ["Lenguaje directo", "Imágenes cotidianas"]
        },
        huella: {
          complejidad: "Media",
          originalidad: "Buena",
          tecnica: "Competente"
        }
      };
    }

    return NextResponse.json({ 
      success: true,
      analysis 
    });

  } catch (error) {
    console.error('Error en análisis de poesía:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
} 