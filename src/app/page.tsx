"use client";

import { Brain, Sparkles, Zap, Upload, FileText, Loader2, BarChart3, Wand2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

interface AnalysisResult {
  dimensions: Record<string, number>;
  topDimensions: Array<{
    name: string;
    label: string;
    percentage: number;
    reasoning: string;
  }>;
}

interface ImprovementResult {
  improvedPrompt: string;
  originalPrompt: string;
  dominantDimension: string;
}

// Componente para contador animado
const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration });
    return animation.stop;
  }, [value, count, duration]);

  return <motion.span>{rounded}</motion.span>;
};

// Componente para barra de progreso animada
const AnimatedProgressBar = ({ 
  percentage, 
  delay = 0,
  label,
  reasoning 
}: { 
  percentage: number; 
  delay?: number;
  label: string;
  reasoning: string;
}) => {
  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="flex items-center justify-between">
        <motion.h5 
          className="font-semibold text-[#141414] text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {label}
        </motion.h5>
        <motion.span 
          className="text-[#1a4fed] font-bold text-xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + 0.4,
            type: "spring",
            stiffness: 200
          }}
        >
          <AnimatedCounter value={percentage} duration={1.5} />%
        </motion.span>
      </div>
      
      {/* Contenedor de la barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div 
          className="h-3 rounded-full bg-gradient-to-r from-[#1a4fed] to-[#cdff07] relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1.5, 
            delay: delay + 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Efecto de brillo que se mueve */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              delay: delay + 0.8,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
      
      <motion.p 
        className="text-sm text-[#8f8989] italic leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.6 }}
      >
        {reasoning}
      </motion.p>
    </motion.div>
  );
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para mejora de prompt
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<ImprovementResult | null>(null);
  const [showImprovement, setShowImprovement] = useState(false);
  const [improvementError, setImprovementError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const minChars = 50;
  const isValidPrompt = prompt.length >= minChars;
  const isEmpty = prompt.length === 0;
  
  // Manejo de drag & drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => file.type === 'text/plain' || file.name.endsWith('.txt'));
    
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPrompt(content);
      };
      reader.readAsText(textFile);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Limpiar errores y resultados anteriores cuando se edita
    if (error) setError(null);
    if (analysisResult) setAnalysisResult(null);
    if (improvementResult) setImprovementResult(null);
    if (showImprovement) setShowImprovement(false);
  };

  // Función para analizar el prompt
  const handleAnalyze = async () => {
    if (!isValidPrompt || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setImprovementResult(null);
    setShowImprovement(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el análisis');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Error conectando con el servidor');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Función para mejorar el prompt
  const handleImprovePrompt = async () => {
    if (!analysisResult || !prompt || isImproving) return;

    setIsImproving(true);
    setImprovementError(null);
    setImprovementResult(null);

    try {
      const dominantDimension = analysisResult.topDimensions[0];
      
      const response = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          originalPrompt: prompt,
          dominantDimension 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error mejorando el prompt');
      }

      setImprovementResult(data);
      setShowImprovement(true);
    } catch (err: any) {
      setImprovementError(err.message || 'Error conectando con el servidor');
    } finally {
      setIsImproving(false);
    }
  };

  // Función para copiar texto al clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aquí podrías agregar una notificación de éxito
    } catch (err) {
      console.error('Error copiando al clipboard:', err);
    }
  };

  const getStatusColor = () => {
    if (isEmpty) return "border-gray-200/50";
    if (isValidPrompt) return "border-[#cdff07]/50 shadow-[#cdff07]/20";
    return "border-[#1a4fed]/50 shadow-[#1a4fed]/20";
  };

  const getStatusText = () => {
    if (isEmpty) return "Esperando tu prompt creativo...";
    if (isValidPrompt) return "¡Perfecto! Listo para analizar";
    return `Necesitas ${minChars - prompt.length} caracteres más`;
  };

  const getStatusIcon = () => {
    if (isEmpty) return <FileText className="h-4 w-4 text-[#8f8989]" />;
    if (isValidPrompt) return <Sparkles className="h-4 w-4 text-[#cdff07]" />;
    return <Zap className="h-4 w-4 text-[#1a4fed]" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Moderno con Gradiente */}
      <header className="bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] px-6 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <Brain className="h-8 w-8 text-[#cdff07] group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-[#cdff07] opacity-20 rounded-full blur-sm group-hover:opacity-30 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#cdff07] tracking-tight">
                Creative Intelligence Profiler
              </h1>
              <p className="text-sm text-gray-300 font-medium">by LabnoLab</p>
            </div>
          </div>
        </div>
      </header>

      {/* Área Principal con Layout de Dos Columnas */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Título Principal */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="h-8 w-8 text-[#1a4fed] animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#141414] via-[#1a4fed] to-[#141414] bg-clip-text text-transparent">
              Analiza tu Prompt Creativo
            </h2>
            <Sparkles className="h-8 w-8 text-[#1a4fed] animate-pulse" />
          </div>
          <p className="text-lg text-[#8f8989] font-medium max-w-lg mx-auto leading-relaxed">
            Descubre el potencial creativo oculto en tus ideas
          </p>
        </div>

        {/* Layout de Dos Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          
          {/* COLUMNA IZQUIERDA - Área de Prompt */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-[#141414] mb-2">
                Escribe tu Prompt
              </h3>
              <p className="text-[#8f8989]">
                Comparte tu idea creativa y descubre tu perfil
              </p>
            </div>

            {/* Área de Prompt Interactiva */}
            <div className="group">
              <div
                className={`relative bg-white/70 backdrop-blur-xl border-2 ${getStatusColor()} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                  isDragActive ? 'border-[#cdff07] bg-[#cdff07]/5 scale-[1.02]' : ''
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Gradiente de fondo sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#cdff07]/5 via-transparent to-[#1a4fed]/5 rounded-2xl"></div>
                
                {/* Contenido del área de prompt */}
                <div className="relative z-10 p-6">
                  
                  {/* Header del área de prompt */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#cdff07]/20 to-[#1a4fed]/20 flex items-center justify-center">
                        {getStatusIcon()}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#141414]">Tu Prompt Creativo</h4>
                        <p className="text-sm text-[#8f8989]">{getStatusText()}</p>
                      </div>
                    </div>
                    
                    {/* Contador de caracteres */}
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#141414]">
                        {prompt.length}
                      </div>
                      <div className="text-xs text-[#8f8989]">
                        caracteres
                      </div>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={handleTextChange}
                      disabled={isAnalyzing}
                      placeholder="Escribe o pega tu prompt creativo aquí... 

Ejemplos:
• Describe una idea de producto innovador
• Comparte tu visión para un proyecto creativo
• Explica un desafío que quieres resolver

También puedes arrastrar un archivo .txt aquí ↓"
                      className={`w-full h-64 p-4 bg-transparent border-0 resize-none focus:outline-none text-[#141414] placeholder-[#8f8989]/70 text-base leading-relaxed ${
                        isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    
                    {/* Overlay de drag & drop */}
                    {isDragActive && (
                      <div className="absolute inset-0 bg-[#cdff07]/10 border-2 border-dashed border-[#cdff07] rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <Upload className="h-8 w-8 text-[#cdff07] mx-auto animate-bounce" />
                          <p className="text-[#141414] font-semibold">Suelta tu archivo aquí</p>
                          <p className="text-sm text-[#8f8989]">Solo archivos .txt</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Indicador de progreso */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-[#8f8989]">Progreso</span>
                      <span className="text-xs text-[#8f8989]">{Math.min(100, Math.round((prompt.length / minChars) * 100))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isValidPrompt ? 'bg-gradient-to-r from-[#cdff07] to-[#b8e600]' : 'bg-gradient-to-r from-[#1a4fed] to-[#4169ff]'
                        }`}
                        style={{ width: `${Math.min(100, (prompt.length / minChars) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Brillo sutil en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Botón Analizar */}
            <div className="space-y-4">
              <button 
                onClick={handleAnalyze}
                disabled={!isValidPrompt || isAnalyzing}
                className={`w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                  isValidPrompt && !isAnalyzing
                    ? 'bg-gradient-to-r from-[#cdff07] to-[#b8e600] text-[#141414] hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {/* Contenido del botón */}
                <div className="relative flex items-center space-x-3">
                  {isAnalyzing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Brain className="h-5 w-5" />
                  )}
                  <span>
                    {isAnalyzing 
                      ? 'Analizando...' 
                      : isValidPrompt 
                        ? 'Analizar Prompt' 
                        : 'Analizar'
                    }
                  </span>
                </div>
                
                {/* Efecto de brillo para estado activo */}
                {isValidPrompt && !isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
              </button>

              {/* Botón Mejorar Prompt - Solo aparece después del análisis */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.button 
                    onClick={handleImprovePrompt}
                    disabled={isImproving}
                    className={`w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                      !isImproving
                        ? 'bg-gradient-to-r from-[#1a4fed] to-[#4169ff] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {/* Contenido del botón */}
                    <div className="relative flex items-center space-x-3">
                      {isImproving ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Wand2 className="h-5 w-5" />
                      )}
                      <span>
                        {isImproving 
                          ? 'Mejorando...' 
                          : '✨ Mejora tu Prompt'
                        }
                      </span>
                    </div>
                    
                    {/* Efecto de brillo para estado activo */}
                    {!isImproving && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
              
              <p className="text-sm text-[#8f8989] font-medium text-center">
                {error ? (
                  <span className="text-red-500">{error}</span>
                ) : improvementError ? (
                  <span className="text-red-500">{improvementError}</span>
                ) : isAnalyzing ? (
                  'Procesando con IA...'
                ) : isImproving ? (
                  'Mejorando tu prompt...'
                ) : isValidPrompt ? (
                  '¡Tu prompt está listo para ser analizado!'
                ) : (
                  'Escribe al menos 50 caracteres para continuar'
                )}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA - Área de Resultados */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-[#141414] mb-2">
                Tu Perfil Creativo
              </h3>
              <p className="text-[#8f8989]">
                Los resultados del análisis aparecerán aquí
              </p>
            </div>

            {/* Card de Resultados */}
            <div className="h-full min-h-[500px]">
              <AnimatePresence mode="wait">
                {analysisResult ? (
                  /* Mostrar Resultados con Animaciones */
                  <motion.div 
                    key="results"
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50 h-full"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      duration: 0.6
                    }}
                  >
                    <motion.div 
                      className="flex items-center space-x-3 mb-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#cdff07]/20 to-[#1a4fed]/20 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-[#1a4fed]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#141414]">Análisis Completado</h4>
                        <p className="text-sm text-[#8f8989]">Tus dimensiones creativas principales</p>
                      </div>
                    </motion.div>
                    
                    {/* Top Dimensiones con Animaciones Staggered */}
                    <div className="space-y-6">
                      {analysisResult.topDimensions.map((dimension, index) => (
                        <AnimatedProgressBar
                          key={dimension.name}
                          percentage={dimension.percentage}
                          label={dimension.label}
                          reasoning={dimension.reasoning}
                          delay={index * 0.2}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  /* Placeholder Estado Inicial */
                  <motion.div 
                    key="placeholder"
                    className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 rounded-2xl shadow-xl h-full flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center space-y-6 p-8">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[#cdff07]/20 to-[#1a4fed]/20 flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-10 w-10 text-[#8f8989]" />
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#cdff07]/10 to-[#1a4fed]/10 rounded-full blur-lg"></div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-[#141414]">
                          Tu Perfil Creativo aparecerá aquí
                        </h4>
                        <p className="text-[#8f8989] leading-relaxed max-w-sm mx-auto">
                          Analiza tu prompt para descubrir tus dimensiones creativas y conocer tu perfil único
                        </p>
                      </div>

                      {/* Elementos decorativos */}
                      <div className="flex items-center justify-center space-x-2 opacity-50">
                        <div className="h-2 w-2 rounded-full bg-[#cdff07]"></div>
                        <div className="h-2 w-8 rounded-full bg-gradient-to-r from-[#cdff07] to-[#1a4fed]"></div>
                        <div className="h-2 w-2 rounded-full bg-[#1a4fed]"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Sección de Mejora de Prompt */}
        <AnimatePresence>
          {improvementResult && (
            <motion.div
              className="mt-12 max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#1a4fed]/20 to-[#cdff07]/20 flex items-center justify-center">
                      <Wand2 className="h-6 w-6 text-[#1a4fed]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#141414]">Prompt Mejorado</h3>
                      <p className="text-sm text-[#8f8989]">Optimizado desde la perspectiva de {improvementResult.dominantDimension}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowImprovement(!showImprovement)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showImprovement ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {showImprovement && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Prompt Original */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-[#8f8989]">Antes</h4>
                            <button
                              onClick={() => copyToClipboard(improvementResult.originalPrompt)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copiar prompt original"
                            >
                              <Copy className="h-4 w-4 text-[#8f8989]" />
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-[#141414] leading-relaxed">
                              {improvementResult.originalPrompt}
                            </p>
                          </div>
                        </div>

                        {/* Prompt Mejorado */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-[#1a4fed]">Después</h4>
                            <button
                              onClick={() => copyToClipboard(improvementResult.improvedPrompt)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Copiar prompt mejorado"
                            >
                              <Copy className="h-4 w-4 text-[#1a4fed]" />
                            </button>
                          </div>
                          <div className="bg-gradient-to-br from-[#1a4fed]/5 to-[#cdff07]/5 rounded-xl p-4 border border-[#1a4fed]/20">
                            <p className="text-sm text-[#141414] leading-relaxed">
                              {improvementResult.improvedPrompt}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-[#cdff07]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-[#1a4fed]/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-[#cdff07]/5 to-[#1a4fed]/5 blur-3xl"></div>
      </div>
    </div>
  );
}
