"use client";

import { Brain, Sparkles, Zap, Upload, FileText, Loader2, BarChart3, Wand2, Copy, ChevronDown, ChevronUp, Users, Eye, Lightbulb, Bot, Star } from "lucide-react";
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

interface PerspectiveResult {
  dimension: string;
  label: string;
  rewritten_prompt: string;
  insight: string;
}

interface PerspectivesResult {
  perspectives: PerspectiveResult[];
  originalPrompt: string;
  dominantDimension: string;
}

interface TeamMember {
  name: string;
  dimension: string;
  label: string;
  description: string;
  prompt_ready_to_use: string;
  emoji: string;
}

interface TeamResult {
  teamMembers: TeamMember[];
  originalPrompt: string;
  lowestDimensions: string[];
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
  
  // Estados para otras perspectivas
  const [isGeneratingPerspectives, setIsGeneratingPerspectives] = useState(false);
  const [perspectivesResult, setPerspectivesResult] = useState<PerspectivesResult | null>(null);
  const [perspectivesError, setPerspectivesError] = useState<string | null>(null);
  
  // Estados para equipo ideal de IA
  const [isGeneratingTeam, setIsGeneratingTeam] = useState(false);
  const [teamResult, setTeamResult] = useState<TeamResult | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});
  
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
    if (perspectivesResult) setPerspectivesResult(null);
    if (teamResult) setTeamResult(null);
  };

  // Función para analizar el prompt
  const handleAnalyze = async () => {
    if (!isValidPrompt || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setImprovementResult(null);
    setShowImprovement(false);
    setIsGeneratingPerspectives(false);
    setPerspectivesResult(null);

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

  // Función para generar otras perspectivas
  const handleGeneratePerspectives = async () => {
    if (!analysisResult || !prompt || isGeneratingPerspectives) return;

    setIsGeneratingPerspectives(true);
    setPerspectivesError(null);
    setPerspectivesResult(null);

    try {
      const dominantDimension = analysisResult.topDimensions[0];
      
      const response = await fetch('/api/other-perspectives', {
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
        throw new Error(data.error || 'Error generando perspectivas');
      }

      setPerspectivesResult(data);
    } catch (err: any) {
      setPerspectivesError(err.message || 'Error conectando con el servidor');
    } finally {
      setIsGeneratingPerspectives(false);
    }
  };

  const handleGenerateTeam = async () => {
    if (!analysisResult || !prompt) return;

    setIsGeneratingTeam(true);
    setTeamError(null);

    try {
      const response = await fetch('/api/generate-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dimensions: analysisResult.dimensions,
          originalPrompt: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generando equipo ideal');
      }

      setTeamResult(data);
    } catch (err: any) {
      setTeamError(err.message || 'Error conectando con el servidor');
    } finally {
      setIsGeneratingTeam(false);
    }
  };

  const togglePromptExpansion = (assistantName: string) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [assistantName]: !prev[assistantName]
    }));
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

        {/* Layout Responsive Optimizado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMNA IZQUIERDA - Área de Prompt (Altura Fija con Scroll) */}
          <div className="lg:sticky lg:top-8 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
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

            {/* Botones */}
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

              {/* Botón Otras Perspectivas - Solo aparece después del análisis */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.button 
                    onClick={handleGeneratePerspectives}
                    disabled={isGeneratingPerspectives}
                    className={`w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                      !isGeneratingPerspectives
                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {/* Contenido del botón */}
                    <div className="relative flex items-center space-x-3">
                      {isGeneratingPerspectives ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                      <span>
                        {isGeneratingPerspectives 
                          ? 'Generando...' 
                          : '🌈 Otras Perspectivas'
                        }
                      </span>
                    </div>
                    
                    {/* Efecto de brillo para estado activo */}
                    {!isGeneratingPerspectives && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Botón Equipo Ideal de IA - Solo aparece después del análisis */}
              <AnimatePresence>
                {analysisResult && (
                  <motion.button 
                    onClick={handleGenerateTeam}
                    disabled={isGeneratingTeam}
                    className={`w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                      !isGeneratingTeam
                        ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    {/* Contenido del botón */}
                    <div className="relative flex items-center space-x-3">
                      {isGeneratingTeam ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                      <span>
                        {isGeneratingTeam 
                          ? 'Creando...' 
                          : '🤖 Tu Equipo Ideal de IA'
                        }
                      </span>
                    </div>
                    
                    {/* Efecto de brillo para estado activo */}
                    {!isGeneratingTeam && (
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
                ) : perspectivesError ? (
                  <span className="text-red-500">{perspectivesError}</span>
                ) : teamError ? (
                  <span className="text-red-500">{teamError}</span>
                ) : isAnalyzing ? (
                  'Procesando con IA...'
                ) : isImproving ? (
                  'Mejorando tu prompt...'
                ) : isGeneratingPerspectives ? (
                  'Generando perspectivas diversas...'
                ) : isGeneratingTeam ? (
                  'Creando tu equipo ideal de IA...'
                ) : isValidPrompt ? (
                  '¡Tu prompt está listo para ser analizado!'
                ) : (
                  'Escribe al menos 50 caracteres para continuar'
                )}
              </p>
            </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - Área de Resultados (Flujo Vertical) */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-[#141414] mb-2">
                Tu Perfil Creativo
              </h3>
              <p className="text-[#8f8989]">
                Los resultados del análisis aparecerán aquí
              </p>
            </div>

            {/* Card de Resultados */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                {analysisResult ? (
                  /* Mostrar Resultados con Animaciones */
                  <motion.div 
                    key="results"
                    className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50"
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
                    className="bg-white/70 backdrop-blur-xl border-2 border-gray-200/50 rounded-2xl shadow-xl min-h-[500px] flex items-center justify-center"
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

            {/* Sección de Mejora de Prompt - Integrada en Columna Derecha */}
            <AnimatePresence>
              {improvementResult && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#1a4fed]/20 to-[#cdff07]/20 flex items-center justify-center">
                          <Wand2 className="h-5 w-5 text-[#1a4fed]" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#141414]">Prompt Mejorado</h4>
                          <p className="text-xs text-[#8f8989]">Optimizado desde la perspectiva de {improvementResult.dominantDimension}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowImprovement(!showImprovement)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {showImprovement ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                      <div className="space-y-4">
                        {/* Prompt Original */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-[#8f8989] text-sm">Antes</h5>
                            <button
                              onClick={() => copyToClipboard(improvementResult.originalPrompt)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copiar prompt original"
                            >
                              <Copy className="h-3.5 w-3.5 text-[#8f8989]" />
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-[#141414] leading-relaxed">
                              {improvementResult.originalPrompt}
                            </p>
                          </div>
                        </div>

                        {/* Prompt Mejorado */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-[#1a4fed] text-sm">Después</h5>
                            <button
                              onClick={() => copyToClipboard(improvementResult.improvedPrompt)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Copiar prompt mejorado"
                            >
                              <Copy className="h-3.5 w-3.5 text-[#1a4fed]" />
                            </button>
                          </div>
                          <div className="bg-gradient-to-br from-[#1a4fed]/5 to-[#cdff07]/5 rounded-lg p-3 border border-[#1a4fed]/20">
                            <p className="text-xs text-[#141414] leading-relaxed">
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

            {/* Sección de Otras Perspectivas - Integrada en Columna Derecha */}
            <AnimatePresence>
              {perspectivesResult && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                    {/* Header de la sección */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8b5cf6]/20 to-[#a855f7]/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#8b5cf6]" />
                        </div>
                        <h4 className="text-lg font-bold text-[#141414]">🌈 Otras Perspectivas</h4>
                      </div>
                      <p className="text-sm text-[#8f8989] mb-1">¿Cómo verían otros perfiles tu idea?</p>
                      <p className="text-xs text-[#8f8989]">Conecta con la diversidad de tu equipo</p>
                    </div>

                    {/* Grid de Perspectivas - Optimizado para Columna */}
                    <div className="space-y-4">
                      {perspectivesResult.perspectives.map((perspective, index) => (
                        <motion.div
                          key={perspective.dimension}
                          className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200 
                          }}
                        >
                          {/* Header de la card */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#8b5cf6]/20 to-[#a855f7]/20 flex items-center justify-center">
                                <Eye className="h-4 w-4 text-[#8b5cf6]" />
                              </div>
                              <div>
                                <h5 className="font-bold text-[#141414] text-xs">Desde la perspectiva de</h5>
                                <p className="text-[#8b5cf6] font-semibold text-sm">{perspective.label}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(perspective.rewritten_prompt)}
                              className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Copiar prompt desde esta perspectiva"
                            >
                              <Copy className="h-3.5 w-3.5 text-[#8b5cf6]" />
                            </button>
                          </div>

                          {/* Prompt reescrito */}
                          <div className="mb-3">
                            <div className="bg-gradient-to-br from-[#8b5cf6]/5 to-[#a855f7]/5 rounded-lg p-3 border border-[#8b5cf6]/20">
                              <p className="text-xs text-[#141414] leading-relaxed">
                                {perspective.rewritten_prompt}
                              </p>
                            </div>
                          </div>

                          {/* Insight */}
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="h-3.5 w-3.5 text-[#cdff07] mt-0.5 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-[#141414] text-xs mb-1">¿Por qué es valiosa esta perspectiva?</h6>
                                <p className="text-xs text-[#8f8989] leading-relaxed">
                                  {perspective.insight}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer informativo */}
                    <motion.div 
                      className="mt-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#8b5cf6]/10 to-[#a855f7]/10 rounded-full px-3 py-1.5 border border-[#8b5cf6]/20">
                        <Users className="h-3.5 w-3.5 text-[#8b5cf6]" />
                        <p className="text-xs text-[#8b5cf6] font-medium">
                          Complementarias a tu perfil {perspectivesResult.dominantDimension}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sección de Equipo Ideal de IA - Integrada en Columna Derecha */}
            <AnimatePresence>
              {teamResult && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                    {/* Header de la sección */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-[#10b981]" />
                        </div>
                        <h4 className="text-lg font-bold text-[#141414]">🤖 Tu Equipo Ideal de IA</h4>
                      </div>
                      <p className="text-sm text-[#8f8989] mb-1">Asistentes especializados para complementar tu perfil</p>
                      <p className="text-xs text-[#8f8989]">Fortalece tus dimensiones más bajas: {teamResult.lowestDimensions.join(', ')}</p>
                    </div>

                    {/* Grid de Asistentes de IA */}
                    <div className="space-y-4">
                      {teamResult.teamMembers.map((assistant, index) => (
                        <motion.div
                          key={assistant.name}
                          className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200 
                          }}
                        >
                          {/* Header de la card */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 flex items-center justify-center">
                                <span className="text-lg">{assistant.emoji || '🤖'}</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-[#141414] text-sm">{assistant.name}</h5>
                                <p className="text-[#10b981] font-semibold text-xs">Especialista en {assistant.label}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3.5 w-3.5 text-[#cdff07] fill-current" />
                              <span className="text-xs text-[#8f8989] font-medium">IA</span>
                            </div>
                          </div>

                          {/* Descripción del asistente */}
                          <div className="mb-3">
                            <p className="text-xs text-[#141414] leading-relaxed">
                              {assistant.description}
                            </p>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => togglePromptExpansion(assistant.name)}
                              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 rounded-lg border border-[#10b981]/20 hover:from-[#10b981]/20 hover:to-[#059669]/20 transition-all duration-200"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#10b981]" />
                              <span className="text-xs font-medium text-[#10b981]">
                                {expandedPrompts[assistant.name] ? 'Ocultar' : 'Ver'} Prompt
                              </span>
                              {expandedPrompts[assistant.name] ? 
                                <ChevronUp className="h-3.5 w-3.5 text-[#10b981]" /> : 
                                <ChevronDown className="h-3.5 w-3.5 text-[#10b981]" />
                              }
                            </button>
                            <button
                              onClick={() => copyToClipboard(assistant.prompt_ready_to_use)}
                              className="px-3 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                              title="Copiar prompt del asistente"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Prompt expandible */}
                          <AnimatePresence>
                            {expandedPrompts[assistant.name] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="font-semibold text-[#10b981] text-xs">Prompt listo para usar:</h6>
                                    <button
                                      onClick={() => copyToClipboard(assistant.prompt_ready_to_use)}
                                      className="p-1 hover:bg-green-50 rounded transition-colors"
                                      title="Copiar prompt completo"
                                    >
                                      <Copy className="h-3 w-3 text-[#10b981]" />
                                    </button>
                                  </div>
                                  <div className="bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5 rounded-lg p-3 border border-[#10b981]/20">
                                    <p className="text-xs text-[#141414] leading-relaxed whitespace-pre-wrap">
                                      {assistant.prompt_ready_to_use}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                      <div className="h-2 w-2 rounded-full bg-[#10b981]"></div>
                                      <span className="text-xs text-[#8f8989]">Copia y pega en ChatGPT o Claude</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer informativo */}
                    <motion.div 
                      className="mt-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 rounded-full px-3 py-1.5 border border-[#10b981]/20">
                        <Bot className="h-3.5 w-3.5 text-[#10b981]" />
                        <p className="text-xs text-[#10b981] font-medium">
                          Asistentes personalizados para tus dimensiones más bajas
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

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
