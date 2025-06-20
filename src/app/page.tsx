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
  MapPin,
  Brain,
  Target,
  Activity,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Shield,
  CheckCircle
} from 'lucide-react';
import { TrendAnalysis, AnalysisState, UploadState } from '@/types/analysis';

export default function Home() {
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
      const formData = new FormData();
      
      if (file) {
        formData.append('file', file);
      } else if (url && validateURL(url)) {
        formData.append('url', url);
      } else {
        throw new Error('No se proporcionó archivo ni URL válida');
      }

      const response = await fetch('/api/analyze-trend', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el análisis');
      }

      const result: TrendAnalysis = await response.json();
      setAnalysisState({ isLoading: false, result, error: null });
      
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
    if (uploadState.uploadedFile) {
      analyzeContent(uploadState.uploadedFile);
    } else if (uploadState.url) {
      analyzeContent(undefined, uploadState.url);
    } else {
      setAnalysisState(prev => ({ ...prev, error: 'Proporciona un archivo o URL para analizar' }));
    }
  };

  const resetAnalysis = () => {
    setAnalysisState({ isLoading: false, result: null, error: null });
    setUploadState({ isDragOver: false, isUploading: false, uploadedFile: null, url: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-[#00ff88]">LabnoLab</span> | Radar de Futuros
                </h1>
                <p className="text-slate-400 text-sm">Análisis Criminal de Tendencias</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Activity className="w-4 h-4 text-[#00ff88]" />
              <span className="text-sm">Sistema Activo</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!analysisState.result ? (
            /* Upload Section */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              {/* Hero Section */}
              <section className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">
                  Analizamos la actualidad para
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff]">
                    decodificar futuros
                  </span>
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                  Perfilación criminal aplicada a tendencias. Del caos de información a insights transformadores.
                </p>

                {/* Upload Zone */}
                <div className="max-w-4xl mx-auto mb-12">
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300
                      ${uploadState.isDragOver 
                        ? 'border-[#00ff88] bg-[#00ff88]/5 glow-green' 
                        : 'border-slate-600 hover:border-[#00d4ff] hover:bg-[#00d4ff]/5'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          y: uploadState.isDragOver ? -5 : 0,
                          scale: uploadState.isDragOver ? 1.1 : 1 
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`
                          w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                          ${uploadState.isDragOver 
                            ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                            : 'bg-slate-700/50 text-slate-400'
                          }
                        `}
                      >
                        {analysisState.isLoading ? (
                          <Loader2 className="w-10 h-10 animate-spin" />
                        ) : (
                          <Upload className="w-10 h-10" />
                        )}
                      </motion.div>
                      
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {analysisState.isLoading ? 'Analizando contenido...' : 'Sube tus fuentes de información'}
                      </h3>
                      
                      {analysisState.isLoading ? (
                        <div className="text-slate-400 mb-6">
                          <p className="mb-2">Procesando con IA especializada en análisis criminal</p>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse delay-100" />
                            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse delay-200" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 mb-6">
                          Arrastra archivos PDF, DOC, TXT o pega URLs para análisis inmediato
                        </p>
                      )}
                      
                      {!analysisState.isLoading && (
                        <>
                          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="https://ejemplo.com/articulo-tendencia"
                                value={uploadState.url}
                                onChange={(e) => setUploadState(prev => ({ ...prev, url: e.target.value }))}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/20"
                              />
                            </div>
                            <button 
                              onClick={handleAnalyzeClick}
                              disabled={analysisState.isLoading}
                              className="px-8 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Target className="w-5 h-5" />
                              Analizar Tendencia
                            </button>
                          </div>
                          
                          <div className="flex justify-center gap-6 mt-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              PDF, DOC, TXT
                            </div>
                            <div className="flex items-center gap-2">
                              <Link className="w-4 h-4" />
                              URLs & Links
                            </div>
                          </div>
                        </>
                      )}

                      {/* File preview */}
                      {uploadState.uploadedFile && (
                        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#00ff88]" />
                          <span className="text-slate-300">{uploadState.uploadedFile.name}</span>
                          <button 
                            onClick={() => setUploadState(prev => ({ ...prev, uploadedFile: null }))}
                            className="text-slate-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Error Display */}
                      {analysisState.error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <span className="text-red-300">{analysisState.error}</span>
                          <button
                            onClick={() => setAnalysisState(prev => ({ ...prev, error: null }))}
                            className="text-red-400 hover:text-red-300 ml-auto"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Preview */}
              <section className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8">
                    <TrendingUp className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-3">Análisis Predictivo</h4>
                    <p className="text-slate-400">Algoritmos de IA para detectar patrones emergentes y predecir evolución de tendencias</p>
                  </div>
                  
                  <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8">
                    <Brain className="w-12 h-12 text-[#00d4ff] mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-3">Perfilación Avanzada</h4>
                    <p className="text-slate-400">Técnicas forenses aplicadas al análisis de comportamientos y tendencias sociales</p>
                  </div>
                  
                  <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-8">
                    <Target className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-3">Insights Accionables</h4>
                    <p className="text-slate-400">Recomendaciones estratégicas basadas en evidencia para toma de decisiones</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            /* Results Section */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Header con botón para nuevo análisis */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-[#00ff88]" />
                  <h2 className="text-3xl font-bold text-white">Análisis Completado</h2>
                </div>
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Nuevo Análisis
                </button>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Probabilidad de Impacto</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 text-[#00ff88]">
                      {analysisState.result.kpis.impactProbability}%
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisState.result.kpis.impactProbability}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-[#00d4ff]" />
                    <h3 className="text-lg font-semibold text-white">Velocidad de Propagación</h3>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-[#00d4ff]">
                        {analysisState.result.kpis.propagationSpeed}
                      </span>
                      <span className="text-lg text-slate-300">días</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Índice de Credibilidad</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#00ff88] mb-2">
                      {analysisState.result.kpis.credibilityIndex}<span className="text-lg text-slate-300">/100</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                      <span className="text-sm text-slate-300">Fuente verificada</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análisis detallado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Resumen Ejecutivo</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysisState.result.analysis.executiveSummary}</p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-[#00d4ff]" />
                    <h3 className="text-lg font-semibold text-white">Perfilación Criminal</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysisState.result.analysis.criminalProfileAnalysis}</p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Patrones Emergentes</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysisState.result.analysis.emergingPatterns}</p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-[#00d4ff]" />
                    <h3 className="text-lg font-semibold text-white">Proyecciones Futuras</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysisState.result.analysis.futureProjections}</p>
                </div>
              </div>

              {/* Impacto y Geografía */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Sectores Afectados</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisState.result.impact.affectedSectors.map((sector, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
                        <span className="text-slate-300">{sector}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-[#00d4ff]" />
                    <h3 className="text-lg font-semibold text-white">Relevancia Geográfica</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-slate-400">Principal:</span>
                      <p className="text-[#00d4ff] font-semibold">{analysisState.result.impact.geographicRelevance.primary}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Secundarias:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysisState.result.impact.geographicRelevance.secondary.map((region, index) => (
                          <span key={index} className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-[#00ff88]" />
                    <h3 className="text-lg font-semibold text-white">Demografía Objetivo</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisState.result.impact.demographicTargets.map((target, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                        <Users className="w-4 h-4 text-[#00d4ff]" />
                        <span className="text-slate-300">{target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
