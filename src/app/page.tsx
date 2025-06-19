import { Brain, Users, Target, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#141414] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-[#cdff07]" />
            <h1 className="text-2xl font-bold text-[#cdff07]">
              Creative Intelligence Profiler
            </h1>
          </div>
          <div className="text-[#cdff07] text-sm font-medium">
            by LabnoLab
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#141414] mb-6">
            Descubre el Potencial de tu Equipo
          </h2>
          <p className="text-xl text-[#8f8989] max-w-3xl mx-auto mb-8">
            Utiliza inteligencia artificial avanzada para analizar perfiles de personalidad 
            y crear equipos más efectivos y cohesionados.
          </p>
          <button className="bg-[#cdff07] text-[#141414] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#b8e600] transition-colors duration-200 shadow-lg">
            Comenzar Análisis
            <ArrowRight className="inline-block ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-[#1a4fed] transition-colors duration-200 shadow-sm">
            <div className="bg-[#1a4fed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#141414] mb-3">
              Análisis IA Avanzado
            </h3>
            <p className="text-[#8f8989]">
              Procesamiento inteligente de perfiles de personalidad usando modelos de IA de última generación.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-[#1a4fed] transition-colors duration-200 shadow-sm">
            <div className="bg-[#1a4fed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#141414] mb-3">
              Formación de Equipos
            </h3>
            <p className="text-[#8f8989]">
              Algoritmos optimizados para crear equipos balanceados según objetivos específicos.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-[#1a4fed] transition-colors duration-200 shadow-sm">
            <div className="bg-[#1a4fed] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#141414] mb-3">
              Insights Precisos
            </h3>
            <p className="text-[#8f8989]">
              Reportes detallados con recomendaciones actionables para mejorar la dinámica grupal.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#141414] to-[#1a4fed] rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para Transformar tu Equipo?
          </h3>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Comienza ahora y descubre cómo la inteligencia artificial puede potenciar 
            la colaboración y productividad de tu organización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#cdff07] text-[#141414] px-8 py-3 rounded-lg font-semibold hover:bg-[#b8e600] transition-colors duration-200">
              Prueba Gratuita
            </button>
            <button className="border-2 border-[#cdff07] text-[#cdff07] px-8 py-3 rounded-lg font-semibold hover:bg-[#cdff07] hover:text-[#141414] transition-colors duration-200">
              Ver Demo
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#141414] text-[#8f8989] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-[#cdff07]" />
              <span className="text-[#cdff07] font-semibold">LabnoLab</span>
            </div>
            <div className="text-sm">
              © 2024 LabnoLab. Potenciando equipos con inteligencia artificial.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
