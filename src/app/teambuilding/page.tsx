'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Sparkles, 
  Target, 
  Handshake,
  User,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';
import CadaverExquisito from '../../components/CadaverExquisito';

interface DimensionResult {
  name: string;
  percentage: number;
  color: string;
}

export default function TeamBuilding() {
  const [activeTab, setActiveTab] = useState<'individual' | 'cadaver'>('individual');
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<DimensionResult[]>([]);
  const [hasResults, setHasResults] = useState(false);

  const handleAnalyzePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simular análisis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: DimensionResult[] = [
      { name: 'Arquitecto de Sistemas', percentage: 85, color: 'bg-blue-500' },
      { name: 'Obsesión UX', percentage: 72, color: 'bg-green-500' },
      { name: 'Hacker de Procesos', percentage: 91, color: 'bg-purple-500' },
      { name: 'Visión Panorámica', percentage: 68, color: 'bg-orange-500' },
      { name: 'Pensador Disruptivo', percentage: 76, color: 'bg-red-500' },
      { name: 'Integrador de Conocimiento', percentage: 83, color: 'bg-indigo-500' }
    ];
    
    setAnalysisResults(mockResults);
    setHasResults(true);
    setIsAnalyzing(false);
  };

  const handleImprovePrompt = () => {
    // Funcionalidad placeholder
    console.log('Mejorando prompt...');
  };

  const handleOtherPerspectives = () => {
    // Funcionalidad placeholder
    console.log('Generando otras perspectivas...');
  };

  const handleIdealTeam = () => {
    // Funcionalidad placeholder
    console.log('Generando equipo ideal...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Creative Intelligence Profiler
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">by</span>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-900">LabnoLab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-0">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'individual'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className={`h-5 w-5 ${activeTab === 'individual' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span>Análisis Individual</span>
          </button>
          <button
            onClick={() => setActiveTab('cadaver')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
              activeTab === 'cadaver'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className={`h-5 w-5 ${activeTab === 'cadaver' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span>Cadáver Exquisito</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'individual' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Columna Izquierda */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Escribe tu Prompt
                  </h2>
                  <p className="text-gray-600">
                    Comparte tu idea creativa y descubre tu perfil
                  </p>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tu Prompt Creativo"
                    className="w-full h-40 p-4 border-2 border-yellow-200 rounded-lg focus:outline-none focus:border-yellow-400 resize-none"
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {prompt.length} caracteres
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  <button
                    onClick={handleAnalyzePrompt}
                    disabled={isAnalyzing || !prompt.trim()}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>{isAnalyzing ? 'Analizando...' : 'Analizar Prompt'}</span>
                  </button>

                  <button
                    onClick={handleImprovePrompt}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Mejora tu Prompt</span>
                  </button>

                  <button
                    onClick={handleOtherPerspectives}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
                  >
                    <Target className="h-5 w-5" />
                    <span>Otras Perspectivas</span>
                  </button>

                  <button
                    onClick={handleIdealTeam}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                  >
                    <Handshake className="h-5 w-5" />
                    <span>Tu Equipo Ideal de IA</span>
                  </button>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tu Perfil Creativo
                  </h2>
                </div>

                {!hasResults ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Analiza tu prompt para descubrir tu perfil creativo
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Análisis Completado</span>
                    </div>

                    <div className="space-y-4">
                      {analysisResults.map((dimension, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {dimension.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {dimension.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dimension.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-2 rounded-full ${dimension.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'cadaver' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CadaverExquisito />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 