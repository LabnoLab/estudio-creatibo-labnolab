'use client'

import { motion } from 'framer-motion'
import { Plus, Image as ImageIcon, FileText, Lightbulb, Search, Settings, Folder, Home as HomeIcon, X, Copy, Edit2, Check } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [referencias, setReferencias] = useState<string[]>([])
  const [imageTitle, setImageTitle] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [promptName, setPromptName] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [isEditingPromptName, setIsEditingPromptName] = useState(false)
  const [copied, setCopied] = useState(false)

  // Cargar imágenes dinámicamente
  useEffect(() => {
    const imageFiles = [
      'animalitos-gorila.jpeg',
      'animalitos-camaleon.jpeg',
      'animalitos-foca.jpeg',
      'animalitos-cocodrilo.jpeg',
      'parches-marcas.jpeg',
      'teclas-nike.jpeg',
      'teclas-playstation.jpeg',
      'teclas-twich.jpeg',
      'teclas-mcdonalds.jpeg'
    ]
    setReferencias(imageFiles)
  }, [])

  // Función para abrir modal con datos de la imagen
  const openImageModal = (imageName: string) => {
    setSelectedImage(imageName)
    setImageTitle(imageName.replace('.jpeg', '').replace(/-/g, ' '))
    setImagePrompt(`Create a professional digital artwork featuring ${imageName.replace('.jpeg', '').replace(/-/g, ' ')} with modern design elements, clean composition, and attention to detail. Use contemporary color palette and sophisticated typography.`)
    setPromptName(`Prompt para ${imageName.replace('.jpeg', '').replace(/-/g, ' ')}`)
    setIsEditingTitle(false)
    setIsEditingPrompt(false)
    setIsEditingPromptName(false)
    setCopied(false)
  }

  // Función para copiar prompt
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(imagePrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying text: ', err)
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Modal Épico para Referencias */}
      <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 animate-in fade-in-0" />
          <Dialog.Content className="fixed inset-0 z-50 overflow-hidden">
            <div className="h-full flex">
              {/* Imagen Grande - Lado Izquierdo */}
              <div className="flex-1 flex items-center justify-center p-8 bg-[#1a1a1a]">
                <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                  {selectedImage && (
                    <Image
                      src={`/uploads/referencias/${selectedImage}`}
                      alt={imageTitle}
                      fill
                      className="object-contain rounded-xl shadow-2xl"
                      priority
                    />
                  )}
                </div>
              </div>

              {/* Panel de Metadatos - Lado Derecho */}
              <div className="w-96 bg-[#2a2a2a] border-l border-[#404040] flex flex-col">
                {/* Header del Panel */}
                <div className="p-6 border-b border-[#404040]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-[#f8f8f8]">Detalles de Referencia</h2>
                    <Dialog.Close asChild>
                      <button className="w-8 h-8 rounded-lg bg-[#404040] hover:bg-[#4a4a4a] flex items-center justify-center text-[#a0a0a0] hover:text-[#f8f8f8] transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  
                  {/* Título de la Imagen */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#a0a0a0]">Nombre de la imagen</label>
                    {isEditingTitle ? (
                      <input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                        className="w-full p-2 bg-[#1e1e1e] border border-[#404040] rounded-lg text-[#f8f8f8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E55A2B]/30"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-[#f8f8f8] font-medium">{imageTitle}</span>
                        <button
                          onClick={() => setIsEditingTitle(true)}
                          className="p-1 rounded hover:bg-[#404040] text-[#a0a0a0] hover:text-[#f8f8f8] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contenido del Panel */}
                <div className="flex-1 p-6 space-y-6">
                  {/* Nombre del Prompt */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#a0a0a0]">Nombre del prompt</label>
                    {isEditingPromptName ? (
                      <input
                        type="text"
                        value={promptName}
                        onChange={(e) => setPromptName(e.target.value)}
                        onBlur={() => setIsEditingPromptName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingPromptName(false)}
                        className="w-full p-2 bg-[#1e1e1e] border border-[#404040] rounded-lg text-[#f8f8f8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E55A2B]/30"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-[#f8f8f8] font-medium">{promptName}</span>
                        <button
                          onClick={() => setIsEditingPromptName(true)}
                          className="p-1 rounded hover:bg-[#404040] text-[#a0a0a0] hover:text-[#f8f8f8] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prompt Completo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#a0a0a0]">Prompt completo</label>
                    {isEditingPrompt ? (
                      <textarea
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        onBlur={() => setIsEditingPrompt(false)}
                        className="w-full p-3 bg-[#1e1e1e] border border-[#404040] rounded-lg text-[#f8f8f8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E55A2B]/30 resize-none"
                        rows={6}
                        autoFocus
                      />
                    ) : (
                      <div className="relative">
                        <div className="p-3 bg-[#1e1e1e] border border-[#404040] rounded-lg text-[#f8f8f8] text-sm leading-relaxed min-h-[120px]">
                          {imagePrompt}
                        </div>
                        <button
                          onClick={() => setIsEditingPrompt(true)}
                          className="absolute top-2 right-2 p-1 rounded hover:bg-[#404040] text-[#a0a0a0] hover:text-[#f8f8f8] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Metadatos Adicionales */}
                  <div className="space-y-3 pt-2 border-t border-[#404040]">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#a0a0a0]">Agregado:</span>
                      <span className="text-sm text-[#f8f8f8]">Hoy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#a0a0a0]">Categoría:</span>
                      <span className="text-sm text-[#f8f8f8]">Referencia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#a0a0a0]">Uso:</span>
                      <span className="text-sm text-[#f8f8f8]">0 proyectos</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-6 border-t border-[#404040] space-y-3">
                  <button
                    onClick={copyPrompt}
                    className="w-full bg-[#E55A2B] hover:bg-[#D4502A] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copiar Prompt</span>
                      </>
                    )}
                  </button>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-[#404040] hover:bg-[#4a4a4a] text-[#f8f8f8] py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <Dialog.Close asChild>
                      <button className="flex-1 bg-[#2a2a2a] hover:bg-[#333333] text-[#a0a0a0] border border-[#404040] py-2 px-4 rounded-lg font-medium transition-colors">
                        Cerrar
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Sidebar Navigation */}
      <motion.aside 
        className="fixed left-0 top-0 bottom-0 w-16 bg-white/80 backdrop-blur-md border-r border-gray-200 z-50 flex flex-col items-center py-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        {/* Logo */}
        <div className="w-10 h-10 bg-[#E55A2B] rounded-lg flex items-center justify-center mb-8 shadow-sm">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-3">
          <motion.button
            className="w-10 h-10 bg-[#E55A2B] rounded-lg flex items-center justify-center text-white shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Dashboard"
          >
            <HomeIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#E55A2B] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Referencias"
          >
            <ImageIcon className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#E55A2B] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Prompts"
          >
            <FileText className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#E55A2B] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Proyectos"
          >
            <Folder className="w-5 h-5" />
          </motion.button>
        </nav>

        {/* Create Button */}
        <motion.button
          className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center text-white shadow-sm mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Crear"
        >
          <Plus className="w-5 h-5" />
        </motion.button>

        {/* Bottom Settings */}
        <div className="mt-auto">
          <motion.button
            className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#E55A2B] transition-colors"
            whileHover={{ scale: 1.05 }}
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
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-medium text-[#E55A2B] tracking-tight">
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
                    className="bg-gray-100 border-0 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E55A2B]/30 w-64"
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
              className="text-4xl sm:text-5xl font-medium text-gray-800 mb-4 tracking-tight"
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
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#E55A2B] rounded-xl flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Referencias Visuales</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-[#E55A2B] rounded-full flex items-center justify-center text-white hover:bg-[#D4502A] transition-all duration-200 shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-8">
                  Colecciona y organiza imágenes inspiradoras para tus proyectos creativos
                </p>
                
                {/* Grid uniforme de imágenes reales - sin espacios */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-0 mb-8 rounded-xl overflow-hidden">
                  {referencias.slice(0, 6).map((imagen, index) => (
                    <motion.div
                      key={imagen}
                      className="relative aspect-square overflow-hidden cursor-pointer transition-all duration-300"
                      whileHover={{ scale: 1.02, zIndex: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openImageModal(imagen)}
                      title={imagen.replace('.jpeg', '').replace(/-/g, ' ')}
                    >
                      <Image
                        src={`/uploads/referencias/${imagen}`}
                        alt={imagen}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
                
                <motion.p 
                  className="text-sm text-gray-500 font-medium flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="bg-[#E55A2B] w-2 h-2 rounded-full mr-2"></span>
                  {referencias.length} imágenes guardadas
                </motion.p>
              </div>
            </motion.div>

            {/* Biblioteca de Prompts */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#8B7355] rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Biblioteca de Prompts</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-[#8B7355] rounded-full flex items-center justify-center text-white hover:bg-[#7A6349] transition-all duration-200 shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-gray-600 mb-8">
                  Guarda y organiza prompts efectivos para diferentes tipos de contenido
                </p>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-[#8B7355]">
                    <p className="text-sm font-medium text-gray-800">Diseño de Logo</p>
                    <p className="text-xs text-gray-600 mt-1">Crear logo minimalista y moderno...</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-[#E55A2B]">
                    <p className="text-sm font-medium text-gray-800">Contenido Web</p>
                    <p className="text-xs text-gray-600 mt-1">Escribir copy persuasivo para...</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-[#D4AF37]">
                    <p className="text-sm font-medium text-gray-800">Ilustración</p>
                    <p className="text-xs text-gray-600 mt-1">Generar ilustración estilo...</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">8 prompts guardados</p>
              </div>
            </motion.div>

            {/* Proyectos Creativos */}
            <motion.div 
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-sm">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">Proyectos Creativos</h3>
                  </div>
                  <motion.button 
                    className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white hover:bg-[#C49B2A] transition-all duration-200 shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
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
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              variants={itemVariants}
            >
              <div className="text-3xl font-medium text-[#E55A2B] mb-2">{referencias.length}</div>
              <div className="text-sm text-gray-600 font-medium">Referencias</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              variants={itemVariants}
            >
              <div className="text-3xl font-medium text-[#8B7355] mb-2">15</div>
              <div className="text-sm text-gray-600 font-medium">Prompts</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              variants={itemVariants}
            >
              <div className="text-3xl font-medium text-[#D4AF37] mb-2">8</div>
              <div className="text-sm text-gray-600 font-medium">Proyectos</div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              variants={itemVariants}
            >
              <div className="text-3xl font-medium text-[#8B7355] mb-2">42</div>
              <div className="text-sm text-gray-600 font-medium">Creaciones</div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
