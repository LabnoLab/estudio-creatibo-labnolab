'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Feather,
  Search,
  Sparkles,
  Heart,
  Eye,
  Zap,
  Quote,
  Scroll,
  Crown,
  Star,
  Loader2,
  BarChart3,
  Brain,
  Palette
} from 'lucide-react';

interface AnalysisResult {
  metrica: {
    versos: number;
    silabas: number;
    tipo: string;
    ritmo: string;
  };
  figuras: string[];
  emocional: {
    tono: string;
    intensidad: string;
    sentimientos: string[];
  };
  estilo: {
    epoca: string;
    movimiento: string;
    caracteristicas: string[];
  };
  huella: {
    complejidad: string;
    originalidad: string;
    tecnica: string;
  };
}

export default function AnalizadorPoesia() {
  const [poema, setPoema] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [hasResults, setHasResults] = useState(false);

  const handleAnalyze = async () => {
    if (!poema.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analizar-poesia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poema: poema.trim() })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalysis(result.analysis);
        setHasResults(true);
        
        // Guardar contador de poemas analizados
        const saved = localStorage.getItem('labnolab-poemas-analizados');
        const count = saved ? parseInt(saved, 10) + 1 : 1;
        localStorage.setItem('labnolab-poemas-analizados', count.toString());
      } else {
        console.error('Error en el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    setIsAnalyzing(false);
  };

  const contarVersos = (texto: string): number => {
    return texto.split('\n').filter(line => line.trim().length > 0).length;
  };

  const contarPalabras = (texto: string): number => {
    return texto.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Header Poético */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-violet-100 to-purple-100 border-b border-purple-200">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-violet-600/5 to-purple-600/5"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-300/20 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-violet-300/20 rounded-full translate-x-12 translate-y-12"></div>
        
        <div className="relative px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Feather className="h-8 w-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center shadow-sm">
                  <Search className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-purple-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Analizador de Poesía Forense
              </h1>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <span className="text-purple-600 font-medium">by</span>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                  <span className="font-bold text-purple-900">LabnoLab</span>
                </div>
              </div>
              
              <p className="text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed font-light">
                Desentraña los secretos lingüísticos ocultos en cada verso
              </p>
              
              <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-purple-600">
                <div className="flex items-center space-x-2">
                  <Quote className="h-4 w-4" />
                  <span>Análisis Métrico</span>
                </div>
                <div className="text-purple-400">•</div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Perfil Lingüístico</span>
                </div>
                <div className="text-purple-400">•</div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Análisis Emocional</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Columna Izquierda (60%) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Input de Poesía */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-200 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-purple-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Comparte tu Poesía
                  </h2>
                  <p className="text-purple-600 font-light">
                    Pega o escribe los versos que quieres analizar
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    value={poema}
                    onChange={(e) => setPoema(e.target.value)}
                    placeholder="Escribe aquí tus versos...

En la quietud del verso se esconde
la verdad que el alma conoce,
donde cada palabra es un puente
hacia lo eterno que permanece..."
                    className="w-full h-80 p-6 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 resize-none text-purple-800 placeholder-purple-400 bg-purple-50/30"
                    style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                  />
                  
                  {/* Contador */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-sm text-purple-500 bg-white/80 px-3 py-1 rounded-lg">
                    <span>{contarVersos(poema)} versos</span>
                    <span>•</span>
                    <span>{contarPalabras(poema)} palabras</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !poema.trim()}
                    className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-medium text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Analizando versos...</span>
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        <span>Analizar Lingüísticamente</span>
                        <Sparkles className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Decoración literaria */}
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-3 text-purple-400">
                  <Scroll className="h-6 w-6" />
                  <Quote className="h-5 w-5" />
                  <Crown className="h-6 w-6" />
                  <Quote className="h-5 w-5 transform scale-x-[-1]" />
                  <Scroll className="h-6 w-6 transform scale-x-[-1]" />
                </div>
              </div>
            </motion.div>

            {/* Columna Derecha (40%) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-200 shadow-xl p-8">
                <h2 className="text-2xl font-bold text-purple-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Análisis Forense
                </h2>

                {!hasResults ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Eye className="h-10 w-10 text-purple-400" />
                    </div>
                    <p className="text-purple-600 font-light text-lg">
                      Esperando tu poesía...
                    </p>
                    <p className="text-purple-400 text-sm mt-2">
                      Comparte tus versos para descubrir sus secretos
                    </p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* Métricas Poéticas */}
                    <div className="bg-purple-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Métrica y Estructura
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-700">{analysis.metrica.versos}</div>
                          <div className="text-sm text-purple-600">Versos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-700">{analysis.metrica.silabas}</div>
                          <div className="text-sm text-purple-600">Sílabas/verso</div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-purple-600">Tipo:</span>
                          <span className="text-purple-800 font-medium">{analysis.metrica.tipo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Ritmo:</span>
                          <span className="text-purple-800 font-medium">{analysis.metrica.ritmo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Análisis Emocional */}
                    <div className="bg-violet-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                        <Heart className="h-5 w-5 mr-2" />
                        Perfil Emocional
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-purple-600">Tono:</span>
                          <span className="text-purple-800 font-medium">{analysis.emocional.tono}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Intensidad:</span>
                          <span className="text-purple-800 font-medium">{analysis.emocional.intensidad}</span>
                        </div>
                        <div>
                          <span className="text-purple-600 block mb-2">Sentimientos:</span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.emocional.sentimientos.map((sentimiento, index) => (
                              <span key={index} className="px-3 py-1 bg-violet-200 text-violet-800 rounded-full text-xs font-medium">
                                {sentimiento}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Figuras Retóricas */}
                    <div className="bg-purple-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Figuras Retóricas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.figuras.map((figura, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-sm font-medium">
                            {figura}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Huella Dactilar Lingüística */}
                    <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl p-6 border border-purple-200">
                      <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2" />
                        Huella Dactilar Lingüística
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-purple-600">Complejidad:</span>
                          <span className="text-purple-800 font-medium">{analysis.huella.complejidad}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Originalidad:</span>
                          <span className="text-purple-800 font-medium">{analysis.huella.originalidad}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-600">Técnica:</span>
                          <span className="text-purple-800 font-medium">{analysis.huella.tecnica}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-white/60 rounded-xl">
                        <h4 className="text-sm font-semibold text-purple-900 mb-2">Período estimado:</h4>
                        <p className="text-purple-700 font-medium">{analysis.estilo.epoca}</p>
                        <p className="text-purple-600 text-sm">{analysis.estilo.movimiento}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-600">Error en el análisis</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 