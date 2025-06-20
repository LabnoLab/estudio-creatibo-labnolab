export interface TrendAnalysis {
  kpis: {
    impactProbability: number;
    propagationSpeed: number;
    credibilityIndex: number;
  };
  analysis: {
    executiveSummary: string;
    criminalProfileAnalysis: string;
    emergingPatterns: string;
    futureProjections: string;
  };
  impact: {
    affectedSectors: string[];
    geographicRelevance: {
      primary: string;
      secondary: string[];
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    demographicTargets: string[];
  };
  connections: {
    relatedTrends: string[];
    keyActors: string[];
    riskFactors: string[];
  };
  recommendations: {
    immediate: string[];
    mediumTerm: string[];
    monitoring: string[];
  };
  metadata: {
    sourceType: 'url' | 'file';
    sourceName: string;
    analyzedAt: string;
    contentLength: number;
    processingTime: number;
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