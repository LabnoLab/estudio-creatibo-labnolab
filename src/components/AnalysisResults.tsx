'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Globe, 
  Network, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Shield,
  MapPin,
  Brain,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { TrendAnalysis } from '@/types/analysis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalysisResultsProps {
  analysis: TrendAnalysis;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getImpactColor = (value: number) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSpeedIcon = (days: number) => {
    if (days <= 7) return <ArrowUp className="w-4 h-4 text-red-400" />;
    if (days <= 30) return <Minus className="w-4 h-4 text-yellow-400" />;
    return <ArrowDown className="w-4 h-4 text-green-400" />;
  };

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
            <h2 className="text-3xl font-bold text-white">Análisis Completado</h2>
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

        {/* KPIs Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Probabilidad de Impacto */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Probabilidad de Impacto</h3>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getImpactColor(analysis.kpis.impactProbability)}`}>
                {analysis.kpis.impactProbability}%
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-[#00ff88] to-[#00d4ff] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.kpis.impactProbability}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Velocidad de Propagación */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Velocidad de Propagación</h3>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#00d4ff]">
                  {analysis.kpis.propagationSpeed}
                </span>
                <span className="text-lg text-slate-300">días</span>
                {getSpeedIcon(analysis.kpis.propagationSpeed)}
              </div>
              <p className="text-sm text-slate-400">
                Tiempo estimado de adopción masiva
              </p>
            </div>
          </div>

          {/* Índice de Credibilidad */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Índice de Credibilidad</h3>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] mb-2">
                {analysis.kpis.credibilityIndex}<span className="text-lg text-slate-300">/100</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm text-slate-300">Fuente verificada</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Análisis detallado */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen Ejecutivo */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Resumen Ejecutivo</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{analysis.analysis.executiveSummary}</p>
          </div>

          {/* Análisis Criminal */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Perfilación Criminal</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{analysis.analysis.criminalProfileAnalysis}</p>
          </div>

          {/* Patrones Emergentes */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Patrones Emergentes</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{analysis.analysis.emergingPatterns}</p>
          </div>

          {/* Proyecciones Futuras */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Proyecciones Futuras</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{analysis.analysis.futureProjections}</p>
          </div>
        </motion.div>

        {/* Impacto y Geografía */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sectores Afectados */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Sectores Afectados</h3>
            </div>
            <div className="space-y-2">
              {analysis.impact.affectedSectors.map((sector, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
                  <span className="text-slate-300">{sector}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relevancia Geográfica */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Geografía</h3>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">Principal:</span>
                <p className="text-[#00d4ff] font-semibold">{analysis.impact.geographicRelevance.primary}</p>
              </div>
              <div>
                <span className="text-sm text-slate-400">Secundarias:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysis.impact.geographicRelevance.secondary.map((region, index) => (
                    <span key={index} className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grupos Demográficos */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Demografía Objetivo</h3>
            </div>
            <div className="space-y-2">
              {analysis.impact.demographicTargets.map((target, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <Users className="w-4 h-4 text-[#00d4ff]" />
                  <span className="text-slate-300">{target}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conexiones y Recomendaciones */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Red de Conexiones */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-6 h-6 text-[#00d4ff]" />
              <h3 className="text-lg font-semibold text-white">Red de Conexiones</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-[#00ff88] mb-2">Tendencias Relacionadas</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.connections.relatedTrends.map((trend, index) => (
                    <span key={index} className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-1 rounded-full text-[#00ff88]">
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#00d4ff] mb-2">Actores Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.connections.keyActors.map((actor, index) => (
                    <span key={index} className="text-xs bg-[#00d4ff]/10 border border-[#00d4ff]/30 px-3 py-1 rounded-full text-[#00d4ff]">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Factores de Riesgo</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.connections.riskFactors.map((risk, index) => (
                    <span key={index} className="text-xs bg-red-400/10 border border-red-400/30 px-3 py-1 rounded-full text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#00ff88]" />
              <h3 className="text-lg font-semibold text-white">Recomendaciones</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Inmediatas</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.immediate.map((rec, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-2">Mediano Plazo</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.mediumTerm.map((rec, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#00d4ff] mb-2">Monitoreo</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.monitoring.map((rec, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 