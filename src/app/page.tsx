'use client'

import { motion } from 'framer-motion'
import { Plus, Image as ImageIcon, FileText, Lightbulb, Search, Settings, Folder, Home as HomeIcon } from 'lucide-react'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
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
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar Navigation */}
      <motion.aside 
        className="fixed left-0 top-0 bottom-0 w-16 bg-white/80 backdrop-blur-md border-r border-gray-200 z-50 flex flex-col items-center py-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-8">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-4">
          <motion.button
            className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Dashboard"
          >
            <HomeIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-orange-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Referencias"
          >
            <ImageIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-orange-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Prompts"
          >
            <FileText className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-orange-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Proyectos"
          >
            <Folder className="w-5 h-5" />
          </motion.button>
        </nav>

        {/* Create Button */}
        <motion.button
          className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white shadow-lg mt-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Crear"
        >
          <Plus className="w-5 h-5" />
        </motion.button>

        {/* Bottom Settings */}
        <div className="mt-auto">
          <motion.button
            className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-16">
        {/* Minimal Header */}
        <motion.header 
          className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Estudio Creativo LabnoLab
                </h1>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="bg-gray-100 border-0 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="px-8 py-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-800 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4"
              variants={itemVariants}
            >
              Tu Espacio Creativo Digital
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Organiza, inspira y crea con una plataforma diseñada para potenciar tu creatividad
            </motion.p>
          </motion.div>

          {/* Enhanced Main Grid - More Visual Space */}
          <motion.div 
            className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Referencias Visuales */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Referencias Visuales</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-8">
                  Colecciona y organiza imágenes inspiradoras para tus proyectos creativos
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="aspect-square bg-gradient-to-br from-orange-200 to-red-200 rounded-xl"></div>
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl"></div>
                  <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl"></div>
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-teal-200 rounded-xl"></div>
                  <div className="aspect-square bg-gradient-to-br from-yellow-200 to-orange-200 rounded-xl"></div>
                  <div className="aspect-square bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl"></div>
                </div>
                <p className="text-sm text-gray-500 font-medium">12 imágenes guardadas</p>
              </div>
            </motion.div>

            {/* Biblioteca de Prompts */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Biblioteca de Prompts</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-8">
                  Guarda y organiza prompts efectivos para diferentes tipos de contenido
                </p>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-800">Diseño de Logo</p>
                    <p className="text-xs text-gray-600 mt-1">Crear logo minimalista y moderno...</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500">
                    <p className="text-sm font-medium text-gray-800">Contenido Web</p>
                    <p className="text-xs text-gray-600 mt-1">Escribir copy persuasivo para...</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                    <p className="text-sm font-medium text-gray-800">Ilustración</p>
                    <p className="text-xs text-gray-600 mt-1">Generar ilustración estilo...</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">8 prompts guardados</p>
              </div>
            </motion.div>

            {/* Proyectos Creativos */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Proyectos Creativos</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-8">
                  Combina referencias y prompts en proyectos creativos completos
                </p>
                <div className="space-y-4 mb-6">
                  <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Branding Restaurante</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">En progreso</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg"></div>
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg"></div>
                      <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg"></div>
                      <span className="text-xs text-gray-500 font-medium">+5 elementos</span>
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">App Móvil</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">Planificando</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
                      <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg"></div>
                      <span className="text-xs text-gray-500 font-medium">+3 elementos</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">3 proyectos activos</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">23</div>
              <div className="text-sm text-gray-600 font-medium">Referencias</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-sm text-gray-600 font-medium">Prompts</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
              <div className="text-sm text-gray-600 font-medium">Proyectos</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">42</div>
              <div className="text-sm text-gray-600 font-medium">Creaciones</div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
