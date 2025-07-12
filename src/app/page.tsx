'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ImageIcon, TrendingUp, Users, Activity, FolderOpen, Star, Timer, Palette, Target } from 'lucide-react'
import Link from 'next/link'

export default function HubCentralPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        delay: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-[#E55A2B]/10 text-[#E55A2B] px-4 py-2 rounded-full text-sm font-medium mb-6"
            variants={itemVariants}
          >
            <Activity className="w-4 h-4" />
            <span>Hub Central Activo</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl font-medium text-gray-900 mb-6 tracking-tight"
            variants={itemVariants}
          >
            Hub Central
            <span className="block text-[#E55A2B]">LabnoLab</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Plataforma integral para potenciar la creatividad, explorar futuros emergentes 
            y fortalecer equipos de trabajo de manera innovadora
          </motion.p>
        </motion.div>

        {/* Aplicaciones Principales */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Estudio Creativo */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Link href="/referencias">
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E55A2B] to-[#D4502A] rounded-2xl flex items-center justify-center shadow-lg">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2 text-[#E55A2B] group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Abrir</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Estudio Creativo</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Gestiona referencias visuales, organiza prompts creativos y desarrolla proyectos 
                    con herramientas profesionales de diseño.
                  </p>

                  {/* Preview Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#E55A2B]">9</div>
                      <div className="text-xs text-gray-500">Referencias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#8B7355]">15</div>
                      <div className="text-xs text-gray-500">Prompts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#D4AF37]">3</div>
                      <div className="text-xs text-gray-500">Proyectos</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Activo
                    </span>
                    <span className="text-xs text-gray-400">Última actividad: hoy</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Radar de Futuros */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Link href="/radar">
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Explorar</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Radar de Futuros</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Análisis de tendencias emergentes, prospectiva estratégica y 
                    exploración de escenarios futuros para la innovación.
                  </p>

                  {/* Preview Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">5</div>
                      <div className="text-xs text-gray-500">Tendencias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">3</div>
                      <div className="text-xs text-gray-500">Análisis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-xs text-gray-500">Reportes</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Activo
                    </span>
                    <span className="text-xs text-gray-400">Última actividad: hoy</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Team Building */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Timer className="w-12 h-12 text-white mx-auto mb-3" />
                  <span className="text-white font-medium text-lg">Próximamente</span>
                </div>
              </div>

              <div className="p-8 opacity-50">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Conectar</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Team Building</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Herramientas para fortalecer equipos, dinámicas colaborativas 
                  y metodologías innovadoras de trabajo en grupo.
                </p>

                {/* Preview Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-500">Equipos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">0</div>
                    <div className="text-xs text-gray-500">Dinámicas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">0</div>
                    <div className="text-xs text-gray-500">Sesiones</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Planificando
                  </span>
                  <span className="text-xs text-gray-400">Lanzamiento Q2 2025</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Globales */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-3xl font-semibold text-gray-900 text-center mb-12"
            variants={itemVariants}
          >
            Estadísticas Globales
          </motion.h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#E55A2B] to-[#D4502A] rounded-xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">32</div>
              <div className="text-sm text-gray-600 font-medium">Proyectos Totales</div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
              <div className="text-sm text-gray-600 font-medium">Tendencias Analizadas</div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">89%</div>
              <div className="text-sm text-gray-600 font-medium">Tasa de Éxito</div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="text-sm text-gray-600 font-medium">Satisfacción</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Actividad Reciente */}
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-3xl font-semibold text-gray-900 text-center mb-12"
            variants={itemVariants}
          >
            Actividad Reciente
          </motion.h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center space-x-4"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Análisis de tendencias en IA completado</p>
                    <p className="text-sm text-gray-500">Radar de Futuros • Hace 1 hora</p>
                  </div>
                  <span className="text-xs text-gray-400">15:45</span>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 bg-[#E55A2B]/10 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#E55A2B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Nueva referencia visual agregada</p>
                    <p className="text-sm text-gray-500">Estudio Creativo • Hace 2 horas</p>
                  </div>
                  <span className="text-xs text-gray-400">14:30</span>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Radar de Futuros activado exitosamente</p>
                    <p className="text-sm text-gray-500">Sistema • Hace 3 horas</p>
                  </div>
                  <span className="text-xs text-gray-400">13:00</span>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 bg-[#8B7355]/10 rounded-full flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-[#8B7355]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Proyecto &quot;Branding Restaurante&quot; actualizado</p>
                    <p className="text-sm text-gray-500">Estudio Creativo • Hace 5 horas</p>
                  </div>
                  <span className="text-xs text-gray-400">11:15</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
