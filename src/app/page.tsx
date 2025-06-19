import { Brain, Sparkles, Zap } from "lucide-react";

export default function Home() {
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

          {/* Card Elegante para el Prompt */}
          <div className="group">
            <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* Gradiente de fondo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#cdff07]/5 via-transparent to-[#1a4fed]/5 rounded-2xl"></div>
              
              {/* Contenido del placeholder */}
              <div className="relative z-10 text-center space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#cdff07]/20 to-[#1a4fed]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-[#1a4fed]" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#141414]">Área de Prompt</h3>
                  <p className="text-[#8f8989] leading-relaxed">
                    Aquí irá el área de prompt para analizar tu creatividad
                  </p>
                </div>

                {/* Indicadores visuales sutiles */}
                <div className="flex items-center justify-center space-x-2 pt-4">
                  <div className="h-2 w-2 rounded-full bg-[#cdff07]/40"></div>
                  <div className="h-2 w-8 rounded-full bg-[#1a4fed]/40"></div>
                  <div className="h-2 w-2 rounded-full bg-[#cdff07]/40"></div>
                </div>
              </div>

              {/* Brillo sutil en hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Botón Moderno con Efectos */}
          <div className="text-center space-y-4">
            <button 
              disabled 
              className="relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed shadow-lg overflow-hidden group"
            >
              {/* Efecto de fondo animado (para cuando esté habilitado) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#cdff07] to-[#b8e600] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Contenido del botón */}
              <div className="relative flex items-center space-x-3">
                <Brain className="h-5 w-5" />
                <span>Analizar</span>
              </div>
              
              {/* Overlay para estado deshabilitado */}
              <div className="absolute inset-0 bg-gray-300/50 backdrop-blur-sm"></div>
            </button>
            
            <p className="text-sm text-[#8f8989] font-medium">
              Próximamente disponible
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
