'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Link, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Target, 
  Network,
  MapPin,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Zap,
  Calendar,
  DollarSign,
  Users,
  Building,
  Percent,
  Clock,
  Map
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  title: string;
  type: 'documento' | 'url' | 'texto';
  status: 'procesando' | 'completado' | 'error';
  confidence: number;
  trends: string[];
  insights: string[];
  timestamp: Date;
  source?: string;
  metrics?: {
    impactProbability: number;
    propagationSpeed: string;
    credibility: number;
    maturity: string;
    coverage: string;
    sectors: number;
    investment: string;
    potential: number;
  };
}

export default function RadarFuturos() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'connections'>('dashboard');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !urlToAnalyze.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simular análisis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newResult: AnalysisResult = {
      id: Date.now().toString(),
      title: selectedFile ? selectedFile.name : 'Análisis Web',
      type: selectedFile ? 'documento' : 'url',
      status: 'completado',
      confidence: 87,
      trends: ['AI Generativa', 'Automatización', 'Sostenibilidad'],
      insights: [
        'Alto potencial de adopción masiva',
        'Disrupción significativa en múltiples sectores',
        'Marcos regulatorios en desarrollo'
      ],
      timestamp: new Date(),
      source: selectedFile ? undefined : urlToAnalyze,
      metrics: {
        impactProbability: 85,
        propagationSpeed: '12 meses',
        credibility: 90,
        maturity: 'Fase 3',
        coverage: '25 países',
        sectors: 5,
        investment: '$500M',
        potential: 85
      }
    };
    
    setAnalysisResults(prev => [newResult, ...prev]);
    setIsAnalyzing(false);
    setSelectedFile(null);
    setUrlToAnalyze('');
  };

  const hasAnalysis = analysisResults.length > 0;
  const latestAnalysis = analysisResults[0];

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="flex">
        {/* Sidebar Izquierdo */}
        <div className="w-80 bg-slate-900 min-h-screen border-r border-slate-700">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <span className="text-white font-bold text-lg">LabnoLab</span>
              </div>
              <h1 className="text-white text-xl font-bold">Radar de Futuros</h1>
              <p className="text-slate-400 text-sm">Análisis Criminal de Tendencias</p>
            </div>

            {/* Nueva Tendencia */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4">Nueva Tendencia</h3>
              
              {/* Área de Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive ? 'border-green-500 bg-green-500/10' : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-2">Arrastra archivos aquí</p>
                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                  <FileText className="h-3 w-3" />
                  <span>PDF</span>
                  <span>•</span>
                  <FileText className="h-3 w-3" />
                  <span>TXT</span>
                  <span>•</span>
                  <Link className="h-3 w-3" />
                  <span>URLs</span>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.txt,.doc,.docx"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer"
                >
                  o selecciona archivo
                </label>
              </div>

              {/* Selected File */}
              {selectedFile && (
                <div className="mt-3 p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm truncate">{selectedFile.name}</span>
                  </div>
                </div>
              )}

              {/* URL Input */}
              <div className="mt-4">
                <input
                  type="text"
                  value={urlToAnalyze}
                  onChange={(e) => setUrlToAnalyze(e.target.value)}
                  placeholder="https://ejemplo.com/articulo"
                  className="w-full p-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!selectedFile && !urlToAnalyze.trim())}
                className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analizando...</span>
                  </div>
                ) : (
                  'Analizar Tendencia'
                )}
              </button>
            </div>

            {/* Historial */}
            <div>
              <h3 className="text-white font-semibold mb-4">Historial Reciente</h3>
              {analysisResults.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay análisis previos</p>
              ) : (
                <div className="space-y-2">
                  {analysisResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-slate-300 text-sm truncate">{result.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {result.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área Principal */}
        <div className="flex-1 bg-slate-800">
          {/* Tabs */}
          <div className="px-8 py-4 border-b border-slate-700">
            <div className="flex space-x-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'text-white border-b-2 border-green-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`px-6 py-3 font-medium transition-all duration-200 ${
                  activeTab === 'connections'
                    ? 'text-white border-b-2 border-green-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Red de Conexiones
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!hasAnalysis ? (
                    /* Estado inicial */
                    <div className="text-center py-16">
                      <div className="max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Lab</span>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          Analizamos la actualidad para decodificar futuros
                        </h2>
                        <p className="text-slate-400 mb-8">
                          Perfilación criminal aplicada a tendencias tecnológicas y sociales. 
                          Detectamos patrones ocultos y predecimos impactos futuros.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-slate-700 rounded-lg p-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Análisis Predictivo</h3>
                            <p className="text-slate-400 text-sm">
                              Algoritmos avanzados para detectar patrones emergentes
                            </p>
                          </div>
                          
                          <div className="bg-slate-700 rounded-lg p-6">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Brain className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Perfilación Avanzada</h3>
                            <p className="text-slate-400 text-sm">
                              Técnicas criminológicas aplicadas a tendencias
                            </p>
                          </div>
                          
                          <div className="bg-slate-700 rounded-lg p-6">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Target className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Insights Accionables</h3>
                            <p className="text-slate-400 text-sm">
                              Recomendaciones estratégicas basadas en datos
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Página de Resultados */
                    <div className="space-y-8">
                      {/* Grid de Métricas 2x4 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Percent className="h-4 w-4 text-green-500" />
                            <span className="text-slate-400 text-sm">Probabilidad Impacto</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.impactProbability}%</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-slate-400 text-sm">Velocidad Propagación</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.propagationSpeed}</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-slate-400 text-sm">Credibilidad</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.credibility}/100</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <span className="text-slate-400 text-sm">Madurez</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.maturity}</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span className="text-slate-400 text-sm">Cobertura</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.coverage}</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building className="h-4 w-4 text-orange-500" />
                            <span className="text-slate-400 text-sm">Sectores</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.sectors}</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-slate-400 text-sm">Inversión</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.investment}</div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-slate-400 text-sm">Potencial</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{latestAnalysis.metrics?.potential}%</div>
                        </div>
                      </div>

                      {/* Secciones de Análisis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-700 rounded-lg p-6">
                          <h3 className="text-white font-semibold mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-green-500" />
                            Resumen Ejecutivo
                          </h3>
                          <div className="space-y-3">
                            {latestAnalysis.insights.map((insight, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-slate-300 text-sm">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-slate-700 rounded-lg p-6">
                          <h3 className="text-white font-semibold mb-4 flex items-center">
                            <Brain className="h-5 w-5 mr-2 text-purple-500" />
                            Perfilación Criminal
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-slate-300 text-sm">Patrón de adopción acelerada detectado</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-slate-300 text-sm">Factores de resistencia identificados</p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-slate-300 text-sm">Puntos críticos de inflexión mapeados</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Análisis Geográfico */}
                      <div className="bg-slate-700 rounded-lg p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center">
                          <Map className="h-5 w-5 mr-2 text-blue-500" />
                          Análisis Geográfico
                        </h3>
                        <div className="bg-slate-800 rounded-lg p-8 text-center">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">América del Norte</span>
                            </div>
                            <div className="relative">
                              <div className="w-12 h-12 bg-green-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">Europa</span>
                            </div>
                            <div className="relative">
                              <div className="w-10 h-10 bg-green-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">Asia</span>
                            </div>
                            <div className="relative">
                              <div className="w-8 h-8 bg-green-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">Otros</span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm mt-4">
                            Mapa interactivo con distribución de adopción por regiones
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'connections' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <Network className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Red de Conexiones</h3>
                  <p className="text-slate-400">
                    Visualización de conexiones entre tendencias próximamente
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 