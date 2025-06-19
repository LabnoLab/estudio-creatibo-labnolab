import { Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Simple */}
      <header className="bg-[#141414] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <Brain className="h-6 w-6 text-[#cdff07]" />
          <h1 className="text-lg font-semibold text-[#cdff07]">
            Creative Intelligence Profiler by LabnoLab
          </h1>
        </div>
      </header>

      {/* Área Principal */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#141414] mb-4">
            Analiza tu Prompt Creativo
          </h2>
        </div>

        {/* Área de Prompt Placeholder */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-12 text-center mb-8">
          <p className="text-[#8f8989] text-lg">
            Aquí irá el área de prompt
          </p>
        </div>

        {/* Botón Analizar */}
        <div className="text-center">
          <button 
            disabled 
            className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Analizar
          </button>
        </div>
      </main>
    </div>
  );
}
