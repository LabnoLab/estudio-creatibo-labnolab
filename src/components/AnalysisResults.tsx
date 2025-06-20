'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Globe, 
  Activity, 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  Shield,
  MapPin,
  Brain
} from 'lucide-react';
import { TrendAnalysis } from '@/types/analysis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalysisResultsProps {
  analysis: TrendAnalysis;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header con metadata */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-[#00ff88]" />
            <h2 className="text-3xl font-bold text-white">Análisis Radar de Futuros</h2>
            <span className="px-2 py-1 bg-[#00ff88]/20 border border-[#00ff88]/30 rounded text-xs text-[#00ff88]">
              v{analysis.metadata.metodologia_version}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <span>Fuente: {analysis.metadata.sourceName}</span>
            <span>•</span>
            <span>
              {format(new Date(analysis.metadata.analyzedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
            </span>
            <span>•</span>
            <span>{analysis.metadata.contentLength} caracteres analizados</span>
          </div>
        </motion.div>

        {/* KPIs Grid - 8 KPIs según metodología */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#00ff88]" />
              <h4 className="text-sm font-semibold text-white">Probabilidad Impacto</h4>
            </div>
            <div className="text-2xl font-bold text-[#00ff88]">{analysis.kpis.probabilidad_impacto}%</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#00d4ff]" />
              <h4 className="text-sm font-semibold text-white">Velocidad Propagación</h4>
            </div>
            <div className="text-2xl font-bold text-[#00d4ff]">{analysis.kpis.velocidad_propagacion}</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#00ff88]" />
              <h4 className="text-sm font-semibold text-white">Credibilidad</h4>
            </div>
            <div className="text-2xl font-bold text-[#00ff88]">{analysis.kpis.indice_credibilidad}/100</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
              <h4 className="text-sm font-semibold text-white">Madurez</h4>
            </div>
            <div className="text-2xl font-bold text-[#00d4ff]">{analysis.kpis.madurez_tecnologica}</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-[#00ff88]" />
              <h4 className="text-sm font-semibold text-white">Cobertura</h4>
            </div>
            <div className="text-2xl font-bold text-[#00ff88]">{analysis.kpis.cobertura_geografica}</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
              <h4 className="text-sm font-semibold text-white">Sectores</h4>
            </div>
            <div className="text-2xl font-bold text-[#00d4ff]">{analysis.kpis.sectores_afectados_count}</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-[#00ff88]" />
              <h4 className="text-sm font-semibold text-white">Inversión</h4>
            </div>
            <div className="text-lg font-bold text-[#00ff88]">{analysis.kpis.inversion_asociada}</div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-[#00d4ff]" />
              <h4 className="text-sm font-semibold text-white">Potencial</h4>
            </div>
            <div className="text-lg font-bold text-[#00d4ff]">{analysis.kpis.potencial_disruptivo}</div>
          </div>
        </motion.div>

        {/* 8 Secciones de Análisis según metodología */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Resumen Ejecutivo */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Resumen Ejecutivo</h3>
            </div>
            <div className="space-y-3">
              <div><span className="text-slate-400">Concepto:</span> <span className="text-white">{analysis.analisis.resumen_ejecutivo.concepto_principal}</span></div>
              <div><span className="text-slate-400">Impacto:</span> <span className="text-[#00ff88]">{analysis.analisis.resumen_ejecutivo.puntuacion_impacto}/10</span></div>
              <div><span className="text-slate-400">Adopción:</span> <span className="text-[#00d4ff]">{analysis.analisis.resumen_ejecutivo.tiempo_adopcion}</span></div>
              <div className="flex flex-wrap gap-2">
                {analysis.analisis.resumen_ejecutivo.palabras_clave.map((palabra, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{palabra}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Perfilación Criminal */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Perfilación Criminal</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-400 font-medium">Evidencia:</span> <p className="text-slate-300 mt-1">{analysis.analisis.perfilacion_criminal.patron_evidencia}</p></div>
              <div><span className="text-slate-400 font-medium">Modus Operandi:</span> <p className="text-slate-300 mt-1">{analysis.analisis.perfilacion_criminal.modus_operandi}</p></div>
              <div><span className="text-slate-400 font-medium">Perfil:</span> <p className="text-slate-300 mt-1">{analysis.analisis.perfilacion_criminal.perfil_adopcion}</p></div>
              <div><span className="text-slate-400 font-medium">Conexiones:</span> <p className="text-slate-300 mt-1">{analysis.analisis.perfilacion_criminal.conexiones_ocultas}</p></div>
            </div>
          </div>

          {/* 3. Análisis Geográfico */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Análisis Geográfico</h3>
            </div>
            <div className="space-y-3">
              <div><span className="text-slate-400">Epicentro:</span> <span className="text-[#00ff88]">{analysis.analisis.analisis_geografico.epicentro}</span></div>
              <div>
                <span className="text-slate-400">Adopción:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.analisis.analisis_geografico.zonas_adopcion.map((zona, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-300">{zona}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Resistencias:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.analisis.analisis_geografico.resistencias.map((zona, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300">{zona}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Proyecciones Futuras */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Proyecciones Futuras</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-green-400 font-medium">Optimista:</span> <p className="text-slate-300 mt-1">{analysis.analisis.proyecciones_futuras.escenario_optimista}</p></div>
              <div><span className="text-red-400 font-medium">Pesimista:</span> <p className="text-slate-300 mt-1">{analysis.analisis.proyecciones_futuras.escenario_pesimista}</p></div>
              <div><span className="text-slate-400 font-medium">Realista:</span> <p className="text-slate-300 mt-1">{analysis.analisis.proyecciones_futuras.escenario_realista}</p></div>
              <div>
                <span className="text-amber-400 font-medium">Triggers:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.analisis.proyecciones_futuras.triggers_aceleracion.map((trigger, idx) => (
                    <span key={idx} className="px-2 py-1 bg-amber-900/20 border border-amber-500/30 rounded text-xs text-amber-300">{trigger}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags y Recomendaciones según nueva estructura */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 5. Tags y Conexiones */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Tags y Conexiones</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-400 font-medium">Primarios:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.conexiones.tags_primarios.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#00ff88]/20 border border-[#00ff88]/30 rounded text-xs text-[#00ff88]">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400 font-medium">Tecnologías:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.conexiones.tags_secundarios.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded text-xs text-[#00d4ff]">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400 font-medium">Impacto:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.conexiones.tags_impacto.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-amber-900/20 border border-amber-500/30 rounded text-xs text-amber-300">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400 font-medium">Geografía:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.conexiones.tags_geograficos.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Sectores Objetivo */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Sectores Objetivo</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400 font-medium">Macro Sectores:</span>
                <div className="space-y-2 mt-2">
                  {analysis.impacto.macro_sectores.map((sector, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                      <div className="w-2 h-2 bg-[#00d4ff] rounded-full" />
                      <span className="text-slate-300 text-sm">{sector}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400 font-medium">Sectores Específicos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.impacto.sectores_afectados.map((sector, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{sector}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 7. Recomendaciones Estratégicas */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Recomendaciones Estratégicas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-[#00ff88] mb-2">Para Inversores</h4>
                <ul className="space-y-1">
                  {analysis.recomendaciones.para_inversores.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-1 h-1 bg-[#00ff88] rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#00d4ff] mb-2">Para Empresas</h4>
                <ul className="space-y-1">
                  {analysis.recomendaciones.para_empresas.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-1 h-1 bg-[#00d4ff] rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-400 mb-2">Para Reguladores</h4>
                <ul className="space-y-1">
                  {analysis.recomendaciones.para_reguladores.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-400 mb-2">Para Sociedad</h4>
                <ul className="space-y-1">
                  {analysis.recomendaciones.para_sociedad.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preparado para futuras funcionalidades: Mapa y Grafo */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Mapa Geográfico</h3>
            </div>
            <div className="h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/30">
              <div className="text-center">
                <Globe className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Visualización de propagación geográfica</p>
                <p className="text-xs text-slate-600 mt-1">(Próximamente)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Grafo de Conexiones</h3>
            </div>
            <div className="h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/30">
              <div className="text-center">
                <Brain className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Red de tendencias relacionadas</p>
                <p className="text-xs text-slate-600 mt-1">(Próximamente)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 