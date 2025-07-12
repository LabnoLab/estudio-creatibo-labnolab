import path from 'path';
import fs from 'fs';

interface PromptsConfig {
  teambuilding: {
    analizar: string;
    perfil_individual: string;
    dinamicas_grupo: string;
    cadaver_exquisito: string;
    mejorar_desde_dimension: string;
    otras_perspectivas: string;
  };
  radar: {
    analizar: string;
    documento: string;
    url: string;
    texto: string;
    metricas: string;
  };
  referencias: {
    mejorar_prompt: string;
    analizar_imagen: string;
    tags_automaticos: string;
  };
  general: {
    sistema: string;
    error: string;
    analisis_dimensiones: string;
  };
  dimensiones: {
    [key: string]: {
      name: string;
      description: string;
      category: string;
      keywords: string[];
    };
  };
  configuracion: {
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
}

let cachedPrompts: PromptsConfig | null = null;

export async function loadPrompts(): Promise<PromptsConfig> {
  // Usar caché si ya está cargado
  if (cachedPrompts) {
    return cachedPrompts;
  }

  try {
    const promptsPath = path.join(process.cwd(), 'src', 'config', 'prompts.json');
    const promptsFile = fs.readFileSync(promptsPath, 'utf8');
    cachedPrompts = JSON.parse(promptsFile) as PromptsConfig;
    return cachedPrompts;
  } catch (error) {
    console.error('Error loading prompts.json:', error);
    throw new Error('No se pudo cargar la configuración de prompts');
  }
}

export async function getPrompt(section: keyof PromptsConfig, key: string): Promise<string> {
  const prompts = await loadPrompts();
  
  if (!prompts[section]) {
    throw new Error(`Sección de prompts '${section}' no encontrada`);
  }
  
  const sectionPrompts = prompts[section] as Record<string, string>;
  if (!sectionPrompts[key]) {
    throw new Error(`Prompt '${key}' no encontrado en sección '${section}'`);
  }
  
  return sectionPrompts[key];
}

export async function getSystemPrompt(): Promise<string> {
  return await getPrompt('general', 'sistema');
}

export async function getErrorPrompt(): Promise<string> {
  return await getPrompt('general', 'error');
}

export async function getDimensions(): Promise<PromptsConfig['dimensiones']> {
  const prompts = await loadPrompts();
  return prompts.dimensiones;
}

export async function getConfiguration(): Promise<PromptsConfig['configuracion']> {
  const prompts = await loadPrompts();
  return prompts.configuracion;
}

// Función para compatibilidad con la API principal
export async function getAnalysisConfig(): Promise<{
  systemPrompt: { content: string };
  dimensions: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    keywords: string[];
  }>;
  settings: PromptsConfig['configuracion'];
}> {
  const prompts = await loadPrompts();
  
  // Convertir dimensiones al formato esperado por la API
  const dimensions = Object.entries(prompts.dimensiones).map(([id, data]) => ({
    id,
    name: data.name,
    description: data.description,
    category: data.category,
    keywords: data.keywords
  }));
  
  return {
    systemPrompt: {
      content: prompts.general.analisis_dimensiones
    },
    dimensions,
    settings: prompts.configuracion
  };
} 