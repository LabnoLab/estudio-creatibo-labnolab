"use client";

import { Brain, Sparkles, Plus, X, Upload, FileText, Loader2, BarChart3, Users, Palette, Lightbulb, Copy, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

interface TeamPrompt {
  id: string;
  content: string;
  name?: string;
  role?: string;
}

interface CadaverResult {
  prompt_hibrido: string;
  analisis_colectivo: {
    dimensions: Record<string, number>;
    topDimensions: Array<{
      name: string;
      label: string;
      percentage: number;
      reasoning: string;
    }>;
  };
  dinamicas_colaboracion: {
    estilos_detectados: string[];
    sinergias: string[];
    tensiones_creativas: string[];
    potencial_innovador: string;
  };
  prompts_originales: TeamPrompt[];
  proceso_creativo?: string;
  elementos_preservados?: string[];
  innovaciones_emergentes?: string[];
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

export default function CadaverExquisito() {
  const [prompts, setPrompts] = useState<TeamPrompt[]>([
    { id: '1', content: '', name: '', role: '' },
    { id: '2', content: '', name: '', role: '' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [cadaverResult, setCadaverResult] = useState<CadaverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHybridPrompt, setShowHybridPrompt] = useState(false);

  const minChars = 20;
  const maxPrompts = 5;
  const minPrompts = 2;

  // Validar si se puede crear el cadáver exquisito
  const validPrompts = prompts.filter(p => p.content.trim().length >= minChars);
  const canCreate = validPrompts.length >= minPrompts;

  const addPrompt = () => {
    if (prompts.length < maxPrompts) {
      setPrompts([...prompts, { 
        id: Date.now().toString(), 
        content: '', 
        name: '', 
        role: '' 
      }]);
    }
  };

  const removePrompt = (id: string) => {
    if (prompts.length > minPrompts) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const updatePrompt = (id: string, field: keyof TeamPrompt, value: string) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    
    // Limpiar errores y resultados cuando se edita
    if (error) setError(null);
    if (cadaverResult) setCadaverResult(null);
  };

  const handleCreateCadaver = async () => {
    if (!canCreate) return;

    setIsCreating(true);
    setError(null);

    try {
      const validPromptsData = validPrompts.map(p => ({
        content: p.content.trim(),
        name: p.name?.trim() || undefined,
        role: p.role?.trim() || undefined
      }));

      const response = await fetch('/api/cadaver-exquisito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompts: validPromptsData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creando cadáver exquisito');
      }

      setCadaverResult(data);
    } catch (err: any) {
      setError(err.message || 'Error conectando con el servidor');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Error copiando al clipboard:', err);
    }
  };

  const getPromptStatusColor = (prompt: TeamPrompt) => {
    const length = prompt.content.length;
    if (length === 0) return "border-gray-200/50";
    if (length >= minChars) return "border-[#e879f9]/50 shadow-[#e879f9]/20";
    return "border-[#f59e0b]/50 shadow-[#f59e0b]/20";
  };

  const getPromptStatusText = (prompt: TeamPrompt) => {
    const length = prompt.content.length;
    if (length === 0) return "Esperando prompt creativo...";
    if (length >= minChars) return "¡Listo para el cadáver exquisito!";
    return `Necesitas ${minChars - length} caracteres más`;
  };

  const getPromptStatusIcon = (prompt: TeamPrompt) => {
    const length = prompt.content.length;
    if (length === 0) return <FileText className="h-4 w-4 text-[#8f8989]" />;
    if (length >= minChars) return <Sparkles className="h-4 w-4 text-[#e879f9]" />;
    return <Wand2 className="h-4 w-4 text-[#f59e0b]" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Explicativo del Cadáver Exquisito */}
      <div className="bg-gradient-to-r from-[#e879f9] via-[#c084fc] to-[#e879f9] px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative">
              <Palette className="h-10 w-10 text-white animate-pulse" />
              <div className="absolute -inset-1 bg-white opacity-20 rounded-full blur-sm"></div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Cadáver Exquisito Creativo
            </h1>
            <div className="relative">
              <Users className="h-10 w-10 text-white animate-pulse" />
              <div className="absolute -inset-1 bg-white opacity-20 rounded-full blur-sm"></div>
            </div>
          </div>
          <p className="text-lg text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
            Técnica surrealista colaborativa donde múltiples prompts se combinan para crear algo completamente nuevo e inesperado
          </p>
          <p className="text-sm text-white/80 mt-2">
            Cada contribución individual se transforma en una obra colectiva fascinante
          </p>
        </div>
      </div>

      {/* Área Principal con Layout de Dos Columnas */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Layout Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMNA IZQUIERDA - Prompts del Equipo */}
          <div className="lg:sticky lg:top-8 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-[#141414] mb-2">
                  Prompts del Equipo
                </h3>
                <p className="text-[#8f8989]">
                  Añade entre {minPrompts} y {maxPrompts} prompts para crear el cadáver exquisito
                </p>
              </div>

              {/* Lista de Prompts */}
              <div className="space-y-4">
                {prompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    className="group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`relative bg-white/70 backdrop-blur-xl border-2 ${getPromptStatusColor(prompt)} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                      {/* Gradiente de fondo sutil */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#e879f9]/5 via-transparent to-[#c084fc]/5 rounded-2xl"></div>
                      
                      {/* Contenido del prompt */}
                      <div className="relative z-10 p-6">
                        
                        {/* Header del prompt */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#e879f9]/20 to-[#c084fc]/20 flex items-center justify-center">
                              {getPromptStatusIcon(prompt)}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#141414]">Prompt {index + 1}</h4>
                              <p className="text-xs text-[#8f8989]">{getPromptStatusText(prompt)}</p>
                            </div>
                          </div>
                          
                          {/* Botón eliminar (solo si hay más de 2 prompts) */}
                          {prompts.length > minPrompts && (
                            <button
                              onClick={() => removePrompt(prompt.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar prompt"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </div>

                        {/* Campos de nombre y rol */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <input
                            type="text"
                            placeholder="Nombre (opcional)"
                            value={prompt.name}
                            onChange={(e) => updatePrompt(prompt.id, 'name', e.target.value)}
                            className="px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e879f9] transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="Rol (opcional)"
                            value={prompt.role}
                            onChange={(e) => updatePrompt(prompt.id, 'role', e.target.value)}
                            className="px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e879f9] transition-colors"
                          />
                        </div>

                        {/* Textarea del prompt */}
                        <textarea
                          value={prompt.content}
                          onChange={(e) => updatePrompt(prompt.id, 'content', e.target.value)}
                          disabled={isCreating}
                          placeholder={`Escribe el prompt creativo ${index + 1}...

Ejemplo: "Crear una app que conecte..."
"Diseñar una experiencia que..."
"Desarrollar una estrategia para..."`}
                          className={`w-full h-32 p-4 bg-transparent border-0 resize-none focus:outline-none text-[#141414] placeholder-[#8f8989]/70 text-sm leading-relaxed ${
                            isCreating ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />

                        {/* Contador de caracteres */}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-[#8f8989]">
                            {prompt.content.length} caracteres
                          </span>
                          <div className={`text-xs font-medium ${
                            prompt.content.length >= minChars ? 'text-[#e879f9]' : 'text-[#f59e0b]'
                          }`}>
                            {prompt.content.length >= minChars ? '✓ Listo' : `Mín. ${minChars}`}
                          </div>
                        </div>
                      </div>

                      {/* Brillo sutil en hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Botón añadir prompt */}
              {prompts.length < maxPrompts && (
                <motion.button
                  onClick={addPrompt}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/70 backdrop-blur-xl border-2 border-dashed border-[#e879f9]/50 rounded-2xl hover:border-[#e879f9] hover:bg-[#e879f9]/5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-5 w-5 text-[#e879f9]" />
                  <span className="text-[#e879f9] font-semibold">
                    Añadir Prompt ({prompts.length}/{maxPrompts})
                  </span>
                </motion.button>
              )}

              {/* Botón Crear Cadáver Exquisito */}
              <button 
                onClick={handleCreateCadaver}
                disabled={!canCreate || isCreating}
                className={`w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                  canCreate && !isCreating
                    ? 'bg-gradient-to-r from-[#e879f9] to-[#c084fc] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {/* Contenido del botón */}
                <div className="relative flex items-center space-x-3">
                  {isCreating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Palette className="h-5 w-5" />
                  )}
                  <span>
                    {isCreating 
                      ? 'Creando Cadáver Exquisito...' 
                      : canCreate 
                        ? `🎭 Crear Cadáver Exquisito (${validPrompts.length} prompts)` 
                        : `Necesitas al menos ${minPrompts} prompts válidos`
                    }
                  </span>
                </div>
                
                {/* Efecto de brillo para estado activo */}
                {canCreate && !isCreating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                )}
              </button>
              
              <p className="text-sm text-[#8f8989] font-medium text-center">
                {error ? (
                  <span className="text-red-500">{error}</span>
                ) : isCreating ? (
                  'Combinando prompts de manera surrealista...'
                ) : canCreate ? (
                  `¡${validPrompts.length} prompts listos para el cadáver exquisito!`
                ) : (
                  `Completa al menos ${minPrompts} prompts para continuar`
                )}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA - Perfil Colectivo */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-[#141414] mb-2">
                Perfil Colectivo
              </h3>
              <p className="text-[#8f8989]">
                El resultado del cadáver exquisito aparecerá aquí
              </p>
            </div>

            {/* Card de Resultados */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                {cadaverResult ? (
                  /* Mostrar Resultados del Cadáver Exquisito */
                  <motion.div 
                    key="cadaver-results"
                    className="space-y-6"
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
                    {/* Prompt Híbrido */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#e879f9]/20 to-[#c084fc]/20 flex items-center justify-center">
                            <Palette className="h-5 w-5 text-[#e879f9]" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#141414]">🎭 Prompt Híbrido</h4>
                            <p className="text-xs text-[#8f8989]">Resultado del cadáver exquisito surrealista</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowHybridPrompt(!showHybridPrompt)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {showHybridPrompt ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showHybridPrompt && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="font-semibold text-[#e879f9] text-sm">Prompt Híbrido Resultante:</h5>
                                <button
                                  onClick={() => copyToClipboard(cadaverResult.prompt_hibrido)}
                                  className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Copiar prompt híbrido"
                                >
                                  <Copy className="h-3.5 w-3.5 text-[#e879f9]" />
                                </button>
                              </div>
                              <div className="bg-gradient-to-br from-[#e879f9]/5 to-[#c084fc]/5 rounded-lg p-4 border border-[#e879f9]/20">
                                <p className="text-sm text-[#141414] leading-relaxed">
                                  {cadaverResult.prompt_hibrido}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Perfil Colectivo */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                      <motion.div 
                        className="flex items-center space-x-3 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#e879f9]/20 to-[#c084fc]/20 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-[#e879f9]" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-[#141414]">Perfil Colectivo</h4>
                          <p className="text-sm text-[#8f8989]">Dimensiones creativas del equipo híbrido</p>
                        </div>
                      </motion.div>
                      
                      {/* Top Dimensiones con Animaciones Staggered */}
                      <div className="space-y-6">
                        {cadaverResult.analisis_colectivo.topDimensions.map((dimension, index) => (
                          <AnimatedProgressBar
                            key={dimension.name}
                            percentage={dimension.percentage}
                            label={dimension.label}
                            reasoning={dimension.reasoning}
                            delay={index * 0.2}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Dinámicas de Colaboración */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200/50">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#10b981]" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#141414]">🤝 Dinámicas de Colaboración</h4>
                          <p className="text-xs text-[#8f8989]">Análisis de la sinergia creativa del equipo</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Estilos Detectados */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#141414] text-sm flex items-center space-x-2">
                            <Palette className="h-4 w-4 text-[#e879f9]" />
                            <span>Estilos Detectados</span>
                          </h5>
                          <div className="space-y-1">
                            {cadaverResult.dinamicas_colaboracion.estilos_detectados.map((estilo, index) => (
                              <div key={index} className="text-xs text-[#8f8989] bg-gray-50 rounded px-2 py-1">
                                {estilo}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sinergias */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#141414] text-sm flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-[#10b981]" />
                            <span>Sinergias</span>
                          </h5>
                          <div className="space-y-1">
                            {cadaverResult.dinamicas_colaboracion.sinergias.map((sinergia, index) => (
                              <div key={index} className="text-xs text-[#8f8989] bg-green-50 rounded px-2 py-1">
                                {sinergia}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tensiones Creativas */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#141414] text-sm flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-[#f59e0b]" />
                            <span>Tensiones Creativas</span>
                          </h5>
                          <div className="space-y-1">
                            {cadaverResult.dinamicas_colaboracion.tensiones_creativas.map((tension, index) => (
                              <div key={index} className="text-xs text-[#8f8989] bg-orange-50 rounded px-2 py-1">
                                {tension}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Potencial Innovador */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#141414] text-sm flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-[#1a4fed]" />
                            <span>Potencial Innovador</span>
                          </h5>
                          <div className="text-xs text-[#8f8989] bg-blue-50 rounded px-3 py-2 leading-relaxed">
                            {cadaverResult.dinamicas_colaboracion.potencial_innovador}
                          </div>
                        </div>
                      </div>
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
                        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-[#e879f9]/20 to-[#c084fc]/20 flex items-center justify-center mx-auto mb-4">
                          <Palette className="h-10 w-10 text-[#8f8989]" />
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#e879f9]/10 to-[#c084fc]/10 rounded-full blur-lg"></div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-[#141414]">
                          Tu Cadáver Exquisito aparecerá aquí
                        </h4>
                        <p className="text-[#8f8989] leading-relaxed max-w-sm mx-auto">
                          Combina múltiples prompts para crear algo completamente nuevo e inesperado
                        </p>
                      </div>

                      {/* Elementos decorativos */}
                      <div className="flex items-center justify-center space-x-2 opacity-50">
                        <div className="h-2 w-2 rounded-full bg-[#e879f9]"></div>
                        <div className="h-2 w-8 rounded-full bg-gradient-to-r from-[#e879f9] to-[#c084fc]"></div>
                        <div className="h-2 w-2 rounded-full bg-[#c084fc]"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}