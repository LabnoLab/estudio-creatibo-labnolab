'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  TrendingUp, 
  Globe, 
  FileText, 
  Link, 
  BarChart3,
  Brain,
  Target,
  Activity,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Shield,
  Network,
  ArrowLeft,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrendAnalysis {
  summary: string;
  keyTrends: string[];
  futureImplications: string[];
  technologies: string[];
  impactLevel: 'Low' | 'Medium' | 'High';
  timeframe: string;
  metadata: {
    sourceName: string;
    dateAnalyzed: string;
    confidence: number;
  };
}

interface AnalysisState {
  isLoading: boolean;
  result: TrendAnalysis | null;
  error: string | null;
}

interface UploadState {
  isDragOver: boolean;
  isUploading: boolean;
  uploadedFile: File | null;
  url: string;
}

export default function RadarPage() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>({
    isDragOver: false,
    isUploading: false,
    uploadedFile: null,
    url: ''
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null
  });

  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'history'>('upload');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: true }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: false }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragOver: false }));
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && validateFile(file)) {
      setUploadState(prev => ({ ...prev, uploadedFile: file }));
      analyzeContent(file);
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      setAnalysisState(prev => ({ ...prev, error: 'El archivo no puede superar los 10MB' }));
      return false;
    }
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      setAnalysisState(prev => ({ ...prev, error: 'Solo se permiten archivos PDF, DOC, DOCX y TXT' }));
      return false;
    }
    
    return true;
  };

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      setAnalysisState(prev => ({ ...prev, error: 'URL no válida' }));
      return false;
    }
  };

  const analyzeContent = async (file?: File, url?: string) => {
    setAnalysisState({ isLoading: true, result: null, error: null });
    
    try {
      // Simulación de análisis para demostración
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: TrendAnalysis = {
        summary: "Análisis de tendencias emergentes en tecnología e innovación digital",
        keyTrends: [
          "Inteligencia Artificial Generativa",
          "Computación Cuántica",
          "Realidad Aumentada",
          "Blockchain y Web3",
          "Sostenibilidad Digital"
        ],
        futureImplications: [
          "Transformación de la creatividad digital",
          "Nuevos modelos de negocio descentralizados",
          "Evolución de la interacción humano-computadora",
          "Impacto en la educación y el trabajo remoto"
        ],
        technologies: ["AI/ML", "Quantum Computing", "AR/VR", "Blockchain"],
        impactLevel: "High",
        timeframe: "2024-2026",
        metadata: {
          sourceName: file?.name || url || "Análisis de tendencias",
          dateAnalyzed: new Date().toISOString(),
          confidence: 85
        }
      };
      
      setAnalysisState({ isLoading: false, result: mockResult, error: null });
      setActiveTab('analysis');
      
    } catch (error) {
      console.error('Error analyzing content:', error);
      setAnalysisState({
        isLoading: false,
        result: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  const handleAnalyzeClick = () => {
    if (uploadState.url && validateURL(uploadState.url)) {
      analyzeContent(undefined, uploadState.url);
    }
  };

  const resetAnalysis = () => {
    setAnalysisState({ isLoading: false, result: null, error: null });
    setUploadState({ isDragOver: false, isUploading: false, uploadedFile: null, url: '' });
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-[#E55A2B]/10 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-[#E55A2B] hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Hub</span>
              </button>
              <div className="h-6 w-px bg-[#E55A2B]/30" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#E55A2B] to-[#D4AF37] bg-clip-text text-transparent">
                Radar de Futuros
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <Activity className="w-4 h-4 text-[#E55A2B]" />
                <span>Activo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-[#E55A2B]/10">
            {[
              { id: 'upload', label: 'Análisis', icon: Upload },
              { id: 'analysis', label: 'Resultados', icon: BarChart3 },
              { id: 'history', label: 'Historial', icon: Clock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'upload' | 'analysis' | 'history')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-[#E55A2B] text-[#E55A2B]'
                    : 'border-transparent text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Upload Section */}
              <div className="bg-[#111111] rounded-xl p-8 border border-[#E55A2B]/10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E55A2B] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Analizar Tendencias</h2>
                  <p className="text-gray-400">Sube un archivo o proporciona una URL para analizar tendencias futuras</p>
                </div>

                {/* File Upload */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    uploadState.isDragOver
                      ? 'border-[#E55A2B] bg-[#E55A2B]/5'
                      : 'border-[#E55A2B]/30 hover:border-[#E55A2B]/50'
                  }`}
                >
                  <Upload className="w-12 h-12 text-[#E55A2B] mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Arrastra y suelta tu archivo aquí
                  </p>
                  <p className="text-gray-400 mb-4">
                    o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateFile(file)) {
                        setUploadState(prev => ({ ...prev, uploadedFile: file }));
                        analyzeContent(file);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-[#E55A2B] hover:bg-[#D4AF37] text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors inline-block"
                  >
                    Seleccionar archivo
                  </label>
                </div>

                {/* URL Input */}
                <div className="mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Link className="w-5 h-5 text-[#E55A2B]" />
                    <span className="font-medium">O analizar desde URL</span>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={uploadState.url}
                      onChange={(e) => setUploadState(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://ejemplo.com/articulo"
                      className="flex-1 bg-[#1A1A1A] border border-[#E55A2B]/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E55A2B] focus:border-transparent"
                    />
                    <button
                      onClick={handleAnalyzeClick}
                      disabled={!uploadState.url || analysisState.isLoading}
                      className="bg-[#E55A2B] hover:bg-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      {analysisState.isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analizando...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Analizar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {analysisState.isLoading && (
                  <div className="mt-8 text-center">
                    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#E55A2B]/10">
                      <Loader2 className="w-8 h-8 text-[#E55A2B] animate-spin mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Analizando contenido...</p>
                      <p className="text-gray-400">Esto puede tomar unos momentos</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {analysisState.error && (
                  <div className="mt-8">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="font-medium text-red-400">Error en el análisis</span>
                      </div>
                      <p className="text-red-300">{analysisState.error}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analysis' && analysisState.result && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Analysis Results */}
              <div className="bg-[#111111] rounded-xl p-8 border border-[#E55A2B]/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Resultados del Análisis</h2>
                  <button
                    onClick={resetAnalysis}
                    className="bg-[#E55A2B] hover:bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Nuevo Análisis</span>
                  </button>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-[#E55A2B]" />
                      <span className="font-medium">Nivel de Impacto</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      analysisState.result.impactLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                      analysisState.result.impactLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {analysisState.result.impactLevel}
                    </span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-[#E55A2B]" />
                      <span className="font-medium">Horizonte Temporal</span>
                    </div>
                    <span className="text-[#D4AF37]">{analysisState.result.timeframe}</span>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-[#E55A2B]" />
                      <span className="font-medium">Confianza</span>
                    </div>
                    <span className="text-[#D4AF37]">{analysisState.result.metadata.confidence}%</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#E55A2B]" />
                    <span>Resumen Ejecutivo</span>
                  </h3>
                  <p className="text-gray-300 bg-[#1A1A1A] rounded-lg p-4">
                    {analysisState.result.summary}
                  </p>
                </div>

                {/* Key Trends */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#E55A2B]" />
                    <span>Tendencias Clave</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisState.result.keyTrends.map((trend, index) => (
                      <div key={index} className="bg-[#1A1A1A] rounded-lg p-4 border border-[#E55A2B]/10">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#E55A2B] rounded-full"></div>
                          <span>{trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Future Implications */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-[#E55A2B]" />
                    <span>Implicaciones Futuras</span>
                  </h3>
                  <div className="space-y-3">
                    {analysisState.result.futureImplications.map((implication, index) => (
                      <div key={index} className="bg-[#1A1A1A] rounded-lg p-4 border border-[#E55A2B]/10">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#E55A2B] to-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">{index + 1}</span>
                          </div>
                          <span className="text-gray-300">{implication}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Network className="w-5 h-5 text-[#E55A2B]" />
                    <span>Tecnologías Relevantes</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisState.result.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#E55A2B]/10 text-[#E55A2B] rounded-full text-sm font-medium border border-[#E55A2B]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* History Section */}
              <div className="bg-[#111111] rounded-xl p-8 border border-[#E55A2B]/10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E55A2B] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Historial de Análisis</h2>
                  <p className="text-gray-400">Próximamente: Acceso a todos tus análisis anteriores</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 