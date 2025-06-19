"use client";

import { Brain, Sparkles, Zap, Upload, FileText } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
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
        <div className="max-w-4xl mx-auto">
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

      {/* Área Principal con Centrado Elegante */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-2xl space-y-12">
          
          {/* Título Principal con Jerarquía Visual */}
          <div className="text-center space-y-4">
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
              <div className="relative z-10 p-8">
                
                {/* Header del área de prompt */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#cdff07]/20 to-[#1a4fed]/20 flex items-center justify-center">
                      {getStatusIcon()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#141414]">Tu Prompt Creativo</h3>
                      <p className="text-sm text-[#8f8989]">{getStatusText()}</p>
                    </div>
                  </div>
                  
                  {/* Contador de caracteres */}
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      isValidPrompt ? 'text-[#cdff07]' : isEmpty ? 'text-[#8f8989]' : 'text-[#1a4fed]'
                    }`}>
                      {prompt.length}
                    </div>
                    <div className="text-xs text-[#8f8989]">caracteres</div>
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handleTextChange}
                    placeholder="Escribe o pega tu prompt creativo aquí... 

Ejemplos:
• Describe una idea de producto innovador
• Comparte tu visión para un proyecto creativo
• Explica un desafío que quieres resolver

También puedes arrastrar un archivo .txt aquí ↓"
                    className="w-full h-48 p-6 bg-transparent border-0 resize-none focus:outline-none text-[#141414] placeholder-[#8f8989]/70 text-base leading-relaxed"
                    style={{ minHeight: '200px' }}
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

          {/* Botón Moderno con Estados */}
          <div className="text-center space-y-4">
            <button 
              disabled={!isValidPrompt}
              className={`relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-xl shadow-lg overflow-hidden group transition-all duration-300 ${
                isValidPrompt 
                  ? 'bg-gradient-to-r from-[#cdff07] to-[#b8e600] text-[#141414] hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {/* Contenido del botón */}
              <div className="relative flex items-center space-x-3">
                <Brain className="h-5 w-5" />
                <span>{isValidPrompt ? 'Analizar Prompt' : 'Analizar'}</span>
              </div>
              
              {/* Efecto de brillo para estado activo */}
              {isValidPrompt && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              )}
            </button>
            
            <p className="text-sm text-[#8f8989] font-medium">
              {isValidPrompt ? '¡Tu prompt está listo para ser analizado!' : 'Escribe al menos 50 caracteres para continuar'}
            </p>
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
