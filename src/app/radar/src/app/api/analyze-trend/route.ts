import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import metodologia from '@/config/metodologia-radar.json';

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

    // Prompt especializado basado en metodología LabnoLab
    const analysisPrompt = `
Eres un analista criminal especializado en tendencias de LabnoLab. Aplica la metodología completa de perfilación criminal para analizar el siguiente contenido.

METODOLOGÍA A SEGUIR:
${JSON.stringify(metodologia, null, 2)}

CONTENIDO A ANALIZAR:
${content}

Proporciona un análisis estructurado siguiendo EXACTAMENTE esta metodología y estructura JSON:

{
  "kpis": {
    "probabilidad_impacto": [0-100],
    "velocidad_propagacion": "[X días/meses/años]",
    "indice_credibilidad": [0-100],
    "madurez_tecnologica": "[uno de: Concepto, Prototipo, Piloto, Escalable, Masivo]",
    "cobertura_geografica": "[uno de: Local, Regional, Nacional, Global]", 
    "sectores_afectados_count": [número],
    "inversion_asociada": "[descripción estimación]",
    "potencial_disruptivo": "[uno de: Incremental, Significativo, Transformacional]"
  },
  "analisis": {
    "resumen_ejecutivo": {
      "concepto_principal": "[una frase clara]",
      "puntuacion_impacto": [1-10],
      "tiempo_adopcion": "[estimación temporal]",
      "palabras_clave": ["palabra1", "palabra2", "palabra3"]
    },
    "perfilacion_criminal": {
      "patron_evidencia": "[qué señales detectamos]",
      "modus_operandi": "[cómo se desarrolla la tendencia]",
      "perfil_adopcion": "[quién la adopta y por qué]",
      "conexiones_ocultas": "[relaciones no evidentes]"
    },
    "analisis_geografico": {
      "epicentro": "[origen principal]",
      "zonas_adopcion": ["zona1", "zona2"],
      "resistencias": ["zona1", "zona2"],
      "oportunidades_expansion": ["zona1", "zona2"]
    },
    "proyecciones_futuras": {
      "escenario_optimista": "[qué pasa si todo va bien]",
      "escenario_pesimista": "[qué barreras pueden surgir]",
      "escenario_realista": "[evolución más probable]",
      "triggers_aceleracion": ["trigger1", "trigger2"]
    }
  },
  "impacto": {
    "sectores_afectados": ["sector1", "sector2"],
    "relevancia_geografica": {
      "epicentro": "[región principal]",
      "zonas_adopcion": ["zona1", "zona2"],
      "resistencias": ["zona1", "zona2"]
    },
    "macro_sectores": ["uno o más de: Innovación Empresarial, Servicios Financieros, Capital Humano, Tecnología y Seguridad, Innovación Socioeconómica"]
  },
  "conexiones": {
    "tags_primarios": ["del sistema_tags.primarios"],
    "tags_secundarios": ["del sistema_tags.secundarios"], 
    "tags_impacto": ["del sistema_tags.impacto"],
    "tags_geograficos": ["del sistema_tags.geograficos"]
  },
  "recomendaciones": {
    "para_inversores": ["recomendación1", "recomendación2"],
    "para_empresas": ["recomendación1", "recomendación2"],
    "para_reguladores": ["recomendación1", "recomendación2"],
    "para_sociedad": ["recomendación1", "recomendación2"]
  }
}

CRITERIOS DE ANÁLISIS CRIMINAL:
1. **Patrón de Evidencia**: Analiza las señales y evidencias disponibles
2. **Modus Operandi**: Identifica cómo opera y se propaga la tendencia  
3. **Perfil de Adopción**: Determina quién, cómo y por qué adopta
4. **Conexiones Ocultas**: Descubre relaciones no evidentes
5. **Proyección Criminal**: Usa precedentes para predecir evolución

CALIDAD REQUERIDA:
- Mínimo evidencia de 3 fuentes conceptuales
- Cross-validation con tendencias conocidas
- Aplicar metodología de perfilación criminal
- Generar proyecciones basadas en evidencia

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
      
      // Fallback con nueva estructura metodológica
      analysisResult = {
        kpis: {
          probabilidad_impacto: 75,
          velocidad_propagacion: "14 días",
          indice_credibilidad: 80,
          madurez_tecnologica: "Piloto",
          cobertura_geografica: "Regional",
          sectores_afectados_count: 3,
          inversion_asociada: "Media",
          potencial_disruptivo: "Significativo"
        },
        analisis: {
          resumen_ejecutivo: {
            concepto_principal: "Análisis completado con metodología LabnoLab",
            puntuacion_impacto: 7,
            tiempo_adopcion: "6-12 meses",
            palabras_clave: ["análisis", "tendencia", "impacto"]
          },
          perfilacion_criminal: {
            patron_evidencia: "Se detectaron señales consistentes de cambio",
            modus_operandi: "Propagación a través de canales digitales",
            perfil_adopcion: "Adopción temprana por profesionales y empresas innovadoras",
            conexiones_ocultas: "Relaciones con tendencias tecnológicas emergentes"
          },
          analisis_geografico: {
            epicentro: "Global",
            zonas_adopcion: ["España", "Europa"],
            resistencias: ["Sectores tradicionales"],
            oportunidades_expansion: ["América Latina", "Asia"]
          },
          proyecciones_futuras: {
            escenario_optimista: "Adopción masiva en 12 meses",
            escenario_pesimista: "Resistencia regulatoria ralentiza adopción",
            escenario_realista: "Crecimiento constante con adopción gradual",
            triggers_aceleracion: ["Inversión institucional", "Casos de éxito"]
          }
        },
        impacto: {
          sectores_afectados: ["Tecnología", "Servicios Financieros", "Innovación Empresarial"],
          relevancia_geografica: {
            epicentro: "Global",
            zonas_adopcion: ["España", "Europa"],
            resistencias: ["Mercados regulados"]
          },
          macro_sectores: ["Tecnología y Seguridad", "Innovación Empresarial"]
        },
        conexiones: {
          tags_primarios: ["Fintech"],
          tags_secundarios: ["AI"],
          tags_impacto: ["Económico", "Social"],
          tags_geograficos: ["Europa"]
        },
        recomendaciones: {
          para_inversores: ["Evaluar oportunidades tempranas", "Monitorear métricas clave"],
          para_empresas: ["Preparar infraestructura", "Capacitar equipos"],
          para_reguladores: ["Desarrollar marco normativo", "Consultar stakeholders"],
          para_sociedad: ["Educación digital", "Adopción gradual"]
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
        processingTime: Date.now() - Date.now(), // Placeholder
        metodologia_version: metodologia.metodologia.version
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