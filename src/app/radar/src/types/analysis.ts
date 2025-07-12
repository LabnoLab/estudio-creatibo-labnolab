export interface TrendAnalysis {
  kpis: {
    probabilidad_impacto: number;
    velocidad_propagacion: string;
    indice_credibilidad: number;
    madurez_tecnologica: string;
    cobertura_geografica: string;
    sectores_afectados_count: number;
    inversion_asociada: string;
    potencial_disruptivo: string;
  };
  analisis: {
    resumen_ejecutivo: {
      concepto_principal: string;
      puntuacion_impacto: number;
      tiempo_adopcion: string;
      palabras_clave: string[];
    };
    perfilacion_criminal: {
      patron_evidencia: string;
      modus_operandi: string;
      perfil_adopcion: string;
      conexiones_ocultas: string;
    };
    analisis_geografico: {
      epicentro: string;
      zonas_adopcion: string[];
      resistencias: string[];
      oportunidades_expansion: string[];
    };
    proyecciones_futuras: {
      escenario_optimista: string;
      escenario_pesimista: string;
      escenario_realista: string;
      triggers_aceleracion: string[];
    };
  };
  impacto: {
    sectores_afectados: string[];
    relevancia_geografica: {
      epicentro: string;
      zonas_adopcion: string[];
      resistencias: string[];
    };
    macro_sectores: string[];
  };
  conexiones: {
    tags_primarios: string[];
    tags_secundarios: string[];
    tags_impacto: string[];
    tags_geograficos: string[];
  };
  recomendaciones: {
    para_inversores: string[];
    para_empresas: string[];
    para_reguladores: string[];
    para_sociedad: string[];
  };
  metadata: {
    sourceType: 'url' | 'file';
    sourceName: string;
    analyzedAt: string;
    contentLength: number;
    processingTime: number;
    metodologia_version: string;
  };
}

export interface AnalysisState {
  isLoading: boolean;
  result: TrendAnalysis | null;
  error: string | null;
}

export interface UploadState {
  isDragOver: boolean;
  isUploading: boolean;
  uploadedFile: File | null;
  url: string;
}

export interface AnalysisHistoryItem {
  id: string;
  title: string;
  source_url: string | null;
  analysis_data: TrendAnalysis;
  created_at: string;
} 