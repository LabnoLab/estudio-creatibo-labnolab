'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  TrendingUp, 
  Globe, 
  Network, 
  FileText, 
  Link, 
  BarChart3,
  MapPin,
  Brain,
  Target,
  Activity,
  Users
} from 'lucide-react';

export default function Home() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // TODO: Handle file drop
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
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Analizamos la actualidad para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d4ff]">
                decodificar futuros
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Perfilación criminal aplicada a tendencias. Del caos de información a insights transformadores.
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="max-w-4xl mx-auto">
              <div
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300
                  ${isDragOver 
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
                      y: isDragOver ? -5 : 0,
                      scale: isDragOver ? 1.1 : 1 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`
                      w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                      ${isDragOver 
                        ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                        : 'bg-slate-700/50 text-slate-400'
                      }
                    `}
                  >
                    <Upload className="w-10 h-10" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Sube tus fuentes de información
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Arrastra archivos PDF, DOC, TXT o pega URLs para análisis inmediato
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/articulo-tendencia"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/20"
                      />
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00ff88]/25 transition-all duration-300 flex items-center gap-2">
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
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Preview */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-white text-center mb-12">
              Dashboard de Análisis
              <span className="block text-lg font-normal text-slate-400 mt-2">
                Tus análisis aparecerán aquí
              </span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* KPIs Section */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-[#00ff88]" />
                    <h4 className="text-lg font-semibold text-white">KPIs de Tendencias</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Probabilidad de Impacto</span>
                      <span className="text-[#00ff88] font-bold">---%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Velocidad de Propagación</span>
                      <span className="text-[#00d4ff] font-bold">--- días</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Índice de Credibilidad</span>
                      <span className="text-[#00ff88] font-bold">---/100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-[#00d4ff]" />
                    <h4 className="text-lg font-semibold text-white">Segmentos Objetivo</h4>
                  </div>
                  <div className="text-slate-400 text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Perfiles demográficos detectados</p>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-[#00ff88]" />
                    <h4 className="text-lg font-semibold text-white">Mapas Geográficos</h4>
                  </div>
                  <div className="text-slate-400 text-center py-16">
                    <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Distribución geográfica de tendencias</p>
                    <p className="text-sm">Hotspots y zonas de influencia</p>
                  </div>
                </div>
              </div>

              {/* Network Section */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Network className="w-6 h-6 text-[#00d4ff]" />
                    <h4 className="text-lg font-semibold text-white">Red de Conexiones</h4>
                  </div>
                  <div className="text-slate-400 text-center py-16">
                    <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Análisis de relaciones</p>
                    <p className="text-sm">Actores clave y vínculos</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Preview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
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
        </motion.section>
      </main>
    </div>
  );
}
