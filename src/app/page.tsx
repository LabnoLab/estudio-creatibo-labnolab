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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-700/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-[#00ff88]">LabnoLab</span>
              </h1>
              <p className="text-xs text-slate-400">Radar de Futuros</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <Activity className="w-3 h-3 text-[#00ff88]" />
            <span>Análisis Criminal de Tendencias</span>
          </div>
        </div>

        {/* Upload Zone en Sidebar */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Nueva Tendencia</h3>
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
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
                    w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                    ${uploadState.isDragOver 
                      ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                      : 'bg-slate-700/50 text-slate-400'
                    }
                  `}
                >
                  {analysisState.isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </motion.div>
                
                {analysisState.isLoading ? (
                  <div className="text-slate-400 mb-4">
                    <p className="text-sm mb-2">Analizando...</p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-pulse delay-100" />
                      <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm mb-4">
                    Arrastra archivos o pega URLs
                  </p>
                )}
                
                {!analysisState.isLoading && (
                  <>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/articulo"
                        value={uploadState.url}
                        onChange={(e) => setUploadState(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:border-[#00d4ff] focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/20"
                      />
                      
                      <button 
                        onClick={handleAnalyzeClick}
                        disabled={analysisState.isLoading}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <Target className="w-4 h-4" />
                        Analizar Tendencia
                      </button>
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PDF, TXT
                      </div>
                      <div className="flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        URLs
                      </div>
                    </div>
                  </>
                )}

                {uploadState.uploadedFile && (
                  <div className="mt-3 p-2 bg-slate-700/30 rounded-lg flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-slate-300 truncate">{uploadState.uploadedFile.name}</span>
                    <button 
                      onClick={() => setUploadState(prev => ({ ...prev, uploadedFile: null }))}
                      className="text-slate-500 hover:text-red-400 ml-auto"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {analysisState.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-300 text-xs">{analysisState.error}</span>
                    <button
                      onClick={() => setAnalysisState(prev => ({ ...prev, error: null }))}
                      className="text-red-400 hover:text-red-300 ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Historial Simple */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Historial Reciente</h4>
            <div className="space-y-2">
              {analysisState.result && (
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-3 h-3 text-[#00ff88]" />
                    <span className="text-xs text-slate-300">Último análisis</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {analysisState.result.metadata.sourceName}
                  </p>
                </div>
              )}
              <div className="p-3 bg-slate-800/20 rounded-lg border border-slate-700/30 text-center">
                <p className="text-xs text-slate-500">Historial completo próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {!analysisState.result ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center max-w-2xl">
                  <Brain className="w-20 h-20 text-[#00ff88] mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Analizamos la actualidad para
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff]">
                      decodificar futuros
                    </span>
                  </h2>
                  <p className="text-xl text-slate-300 mb-8">
                    Perfilación criminal aplicada a tendencias. Del caos de información a insights transformadores.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6">
                      <TrendingUp className="w-10 h-10 text-[#00ff88] mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-white mb-2">Análisis Predictivo</h4>
                      <p className="text-slate-400 text-sm">Algoritmos de IA para detectar patrones emergentes</p>
                    </div>
                    
                    <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6">
                      <Brain className="w-10 h-10 text-[#00d4ff] mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-white mb-2">Perfilación Avanzada</h4>
                      <p className="text-slate-400 text-sm">Técnicas forenses aplicadas al análisis</p>
                    </div>
                    
                    <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6">
                      <Target className="w-10 h-10 text-[#00ff88] mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-white mb-2">Insights Accionables</h4>
                      <p className="text-slate-400 text-sm">Recomendaciones estratégicas basadas en evidencia</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
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
    </div>
  );
} 