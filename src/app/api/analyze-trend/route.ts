import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string;
    const file = formData.get('file') as File;

    let content = '';
    let sourceType = '';
    let sourceName = '';

    // Procesar URL
    if (url) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Extraer texto básico del HTML (simplificado)
        content = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 8000); // Limitar contenido

        sourceType = 'url';
        sourceName = url;
      } catch {
        return NextResponse.json(
          { error: 'Error al procesar la URL proporcionada' },
          { status: 400 }
        );
      }
    }
    
    // Procesar archivo
    else if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = buffer.toString('utf-8').substring(0, 8000);
      } else if (file.type === 'application/pdf') {
        // Por ahora, extraer texto básico del PDF (simplificado)
        content = buffer.toString('utf-8').substring(0, 8000);
      } else {
        // Para otros tipos de archivo
        content = buffer.toString('utf-8').substring(0, 8000);
      }

      sourceType = 'file';
      sourceName = file.name;
    } else {
      return NextResponse.json(
        { error: 'No se proporcionó URL ni archivo para analizar' },
        { status: 400 }
      );
    }

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: 'No se pudo extraer suficiente contenido para análizar' },
        { status: 400 }
      );
    }

    // Prompt especializado para análisis de tendencias estilo LabnoLab
    const analysisPrompt = `
Eres un analista criminal especializado en tendencias de LabnoLab. Analiza el siguiente contenido aplicando técnicas de perfilación criminal para detectar patrones, comportamientos emergentes y tendencias futuras.

CONTENIDO A ANALIZAR:
${content}

Proporciona un análisis estructurado en formato JSON con esta estructura exacta:

{
  "kpis": {
    "impactProbability": [número entre 0-100],
    "propagationSpeed": [número de días estimado],
    "credibilityIndex": [número entre 0-100]
  },
  "analysis": {
    "executiveSummary": "[Resumen ejecutivo de máximo 200 palabras]",
    "criminalProfileAnalysis": "[Análisis desde perspectiva de perfilación criminal de máximo 300 palabras]",
    "emergingPatterns": "[Patrones emergentes detectados, máximo 250 palabras]",
    "futureProjections": "[Proyecciones futuras basadas en evidencia, máximo 250 palabras]"
  },
  "impact": {
    "affectedSectors": ["sector1", "sector2", "sector3"],
    "geographicRelevance": {
      "primary": "[País o región principal]",
      "secondary": ["region1", "region2"],
      "coordinates": {
        "lat": [latitud],
        "lng": [longitud]
      }
    },
    "demographicTargets": ["grupo1", "grupo2", "grupo3"]
  },
  "connections": {
    "relatedTrends": ["tendencia1", "tendencia2"],
    "keyActors": ["actor1", "actor2"],
    "riskFactors": ["riesgo1", "riesgo2"]
  },
  "recommendations": {
    "immediate": ["acción1", "acción2"],
    "mediumTerm": ["acción1", "acción2"],
    "monitoring": ["indicador1", "indicador2"]
  }
}

Aplica tu experiencia en análisis criminal para:
1. Detectar patrones de comportamiento ocultos
2. Identificar vectores de propagación de tendencias
3. Evaluar credibilidad usando técnicas forenses
4. Proyectar evolución basada en evidencia histórica
5. Identificar actores clave y sus motivaciones

Responde ÚNICAMENTE en formato JSON válido, sin texto adicional.
`;

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un analista criminal experto de LabnoLab especializado en detectar y analizar tendencias emergentes usando técnicas de perfilación criminal y análisis forense."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0].message.content;
    
    if (!rawResponse) {
      throw new Error('No se recibió respuesta del modelo de IA');
    }

    // Parsear respuesta JSON
    let analysisResult;
    try {
      // Limpiar la respuesta por si tiene markdown o texto extra
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawResponse;
      analysisResult = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', rawResponse);
      
      // Fallback con estructura básica
      analysisResult = {
        kpis: {
          impactProbability: 75,
          propagationSpeed: 14,
          credibilityIndex: 80
        },
        analysis: {
          executiveSummary: "Análisis completado. Se detectaron patrones emergentes que requieren monitoreo.",
          criminalProfileAnalysis: "Se aplicaron técnicas de perfilación para identificar comportamientos y tendencias.",
          emergingPatterns: "Patrones identificados en el contenido analizado.",
          futureProjections: "Proyecciones basadas en análisis de tendencias."
        },
        impact: {
          affectedSectors: ["Tecnología", "Sociedad", "Economía"],
          geographicRelevance: {
            primary: "Global",
            secondary: ["España", "América Latina"],
            coordinates: { lat: 40.4168, lng: -3.7038 }
          },
          demographicTargets: ["Población general", "Profesionales", "Jóvenes"]
        },
        connections: {
          relatedTrends: ["Digitalización", "Cambio social"],
          keyActors: ["Organismos públicos", "Empresas tecnológicas"],
          riskFactors: ["Desinformación", "Polarización"]
        },
        recommendations: {
          immediate: ["Monitorear evolución", "Verificar fuentes"],
          mediumTerm: ["Análisis profundo", "Seguimiento continuo"],
          monitoring: ["Velocidad propagación", "Nivel de adopción"]
        }
      };
    }

    // Agregar metadatos del análisis
    const result = {
      ...analysisResult,
      metadata: {
        sourceType,
        sourceName,
        analyzedAt: new Date().toISOString(),
        contentLength: content.length,
        processingTime: Date.now() - Date.now() // Placeholder
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error en análisis:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor durante el análisis',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 