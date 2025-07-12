'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Users,
  Sparkles,
  Upload,
  FileText,
  Loader2,
  BarChart3,
  Wand2,
  ArrowLeft,
  Target,
  Activity,
  Zap,
  Eye,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CadaverExquisito from '@/components/CadaverExquisito';

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

export default function TeamBuildingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'individual' | 'cadaver'>('individual');
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para mejora de prompt
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<ImprovementResult | null>(null);
  
  // Estados para otras perspectivas
  const [isGeneratingPerspectives, setIsGeneratingPerspectives] = useState(false);
  const [perspectivesResult, setPerspectivesResult] = useState<PerspectivesResult | null>(null);
  
  // Estados para equipo ideal de IA
  const [isGeneratingTeam, setIsGeneratingTeam] = useState(false);
  const [teamResult, setTeamResult] = useState<TeamResult | null>(null);

  const minChars = 50;
  const isValidPrompt = prompt.length >= minChars;

  const handleAnalyze = async () => {
    if (!isValidPrompt) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // Simulación de análisis para demostración
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: AnalysisResult = {
        dimensions: {
          analytical: 75,
          creative: 85,
          empathetic: 60,
          systematic: 70,
          innovative: 90
        },
        topDimensions: [
          {
            name: 'innovative',
            label: 'Innovador',
            percentage: 90,
            reasoning: 'El prompt muestra una fuerte tendencia hacia la búsqueda de soluciones novedosas y creativas'
          },
          {
            name: 'creative',
            label: 'Creativo',
            percentage: 85,
            reasoning: 'Se observa una clara orientación hacia el pensamiento divergente y la generación de ideas'
          },
          {
            name: 'analytical',
            label: 'Analítico',
            percentage: 75,
            reasoning: 'Presenta elementos de pensamiento estructurado y análisis de información'
          }
        ]
      };
      
      setAnalysisResult(mockResult);
      
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprovePrompt = async () => {
    if (!analysisResult) return;
    
    setIsImproving(true);
    
    try {
      // Simulación de mejora para demostración
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockImprovement: ImprovementResult = {
        improvedPrompt: `${prompt} [MEJORADO] - Incorporando elementos de innovación y creatividad para maximizar el potencial del equipo`,
        originalPrompt: prompt,
        dominantDimension: 'innovative'
      };
      
      setImprovementResult(mockImprovement);
      
    } catch (error) {
      console.error('Error improving prompt:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleGeneratePerspectives = async () => {
    if (!analysisResult) return;
    
    setIsGeneratingPerspectives(true);
    
    try {
      // Simulación de perspectivas para demostración
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPerspectives: PerspectivesResult = {
        perspectives: [
          {
            dimension: 'analytical',
            label: 'Perspectiva Analítica',
            rewritten_prompt: `Desde un enfoque analítico: ${prompt}`,
            insight: 'Enfoque en datos y métricas para optimizar resultados'
          },
          {
            dimension: 'empathetic',
            label: 'Perspectiva Empática',
            rewritten_prompt: `Considerando el factor humano: ${prompt}`,
            insight: 'Prioriza las necesidades y emociones del equipo'
          }
        ],
        originalPrompt: prompt,
        dominantDimension: 'innovative'
      };
      
      setPerspectivesResult(mockPerspectives);
      
    } catch (error) {
      console.error('Error generating perspectives:', error);
    } finally {
      setIsGeneratingPerspectives(false);
    }
  };

  const handleGenerateTeam = async () => {
    if (!analysisResult) return;
    
    setIsGeneratingTeam(true);
    
    try {
      // Simulación de equipo para demostración
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockTeam: TeamResult = {
        teamMembers: [
          {
            name: 'Alex Innovador',
            dimension: 'innovative',
            label: 'Líder de Innovación',
            description: 'Especialista en generar ideas disruptivas y soluciones creativas',
            prompt_ready_to_use: `Como Alex, un innovador nato, aborda este desafío: ${prompt}`,
            emoji: '💡'
          },
          {
            name: 'Maya Analítica',
            dimension: 'analytical',
            label: 'Analista Estratégica',
            description: 'Experta en análisis de datos y pensamiento estructurado',
            prompt_ready_to_use: `Como Maya, con mentalidad analítica, evalúa: ${prompt}`,
            emoji: '📊'
          },
          {
            name: 'Sam Empático',
            dimension: 'empathetic',
            label: 'Facilitador del Equipo',
            description: 'Especialista en dinámicas humanas y comunicación efectiva',
            prompt_ready_to_use: `Como Sam, enfocándote en las personas, considera: ${prompt}`,
            emoji: '🤝'
          }
        ],
        originalPrompt: prompt,
        lowestDimensions: ['empathetic', 'systematic']
      };
      
      setTeamResult(mockTeam);
      
    } catch (error) {
      console.error('Error generating team:', error);
    } finally {
      setIsGeneratingTeam(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-[#E55A2B]/10 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-[#E55A2B] hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Hub</span>
              </button>
              <div className="h-6 w-px bg-[#E55A2B]/30" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#E55A2B] to-[#D4AF37] bg-clip-text text-transparent">
                Team Building
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <Activity className="w-4 h-4 text-[#E55A2B]" />
                <span>Activo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-[#E55A2B]/10">
            {[
              { id: 'individual', label: 'Análisis Individual', icon: Brain },
              { id: 'cadaver', label: 'Cadáver Exquisito', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-[#E55A2B] text-[#E55A2B]'
                    : 'border-transparent text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Individual Analysis Section */}
              <div className="bg-[#111111] rounded-xl p-8 border border-[#E55A2B]/10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E55A2B] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Análisis de Perfiles</h2>
                  <p className="text-gray-400">Analiza prompts individuales para identificar estilos de pensamiento y generar equipos de IA</p>
                </div>

                {/* Prompt Input */}
                <div className="mb-6">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe tu proyecto, desafío o idea que quieras desarrollar... (mínimo 50 caracteres)"
                    className="w-full h-32 bg-[#1A1A1A] border border-[#E55A2B]/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#E55A2B] focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm ${prompt.length < minChars ? 'text-red-400' : 'text-green-400'}`}>
                      {prompt.length}/{minChars} caracteres mínimos
                    </span>
                    <button
                      onClick={handleAnalyze}
                      disabled={!isValidPrompt || isAnalyzing}
                      className="bg-[#E55A2B] hover:bg-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analizando...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Analizar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {/* Analysis Results */}
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#E55A2B]/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-[#E55A2B]" />
                        <span>Dimensiones Principales</span>
                      </h3>
                      <div className="space-y-4">
                        {analysisResult.topDimensions.map((dimension, index) => (
                          <div key={dimension.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{dimension.label}</span>
                              <span className="text-[#E55A2B] font-bold">{dimension.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="h-2 rounded-full bg-gradient-to-r from-[#E55A2B] to-[#D4AF37]"
                                initial={{ width: 0 }}
                                animate={{ width: `${dimension.percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <p className="text-sm text-gray-400">{dimension.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={handleImprovePrompt}
                        disabled={isImproving}
                        className="bg-[#E55A2B]/10 hover:bg-[#E55A2B]/20 border border-[#E55A2B]/30 text-[#E55A2B] px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        <span>Mejorar Prompt</span>
                      </button>
                      
                      <button
                        onClick={handleGeneratePerspectives}
                        disabled={isGeneratingPerspectives}
                        className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        {isGeneratingPerspectives ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                        <span>Otras Perspectivas</span>
                      </button>
                      
                      <button
                        onClick={handleGenerateTeam}
                        disabled={isGeneratingTeam}
                        className="bg-[#8B7355]/10 hover:bg-[#8B7355]/20 border border-[#8B7355]/30 text-[#8B7355] px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        {isGeneratingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                        <span>Generar Equipo IA</span>
                      </button>
                    </div>

                    {/* Results Display */}
                    {improvementResult && (
                      <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#E55A2B]/10">
                        <h4 className="font-semibold mb-2 text-[#E55A2B]">Prompt Mejorado:</h4>
                        <p className="text-gray-300">{improvementResult.improvedPrompt}</p>
                      </div>
                    )}

                    {perspectivesResult && (
                      <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#D4AF37]/10">
                        <h4 className="font-semibold mb-4 text-[#D4AF37]">Perspectivas Alternativas:</h4>
                        <div className="space-y-4">
                          {perspectivesResult.perspectives.map((perspective, index) => (
                            <div key={index} className="border-l-2 border-[#D4AF37]/30 pl-4">
                              <h5 className="font-medium text-[#D4AF37]">{perspective.label}</h5>
                              <p className="text-gray-300 text-sm mt-1">{perspective.rewritten_prompt}</p>
                              <p className="text-gray-400 text-xs mt-2">{perspective.insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {teamResult && (
                      <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#8B7355]/10">
                        <h4 className="font-semibold mb-4 text-[#8B7355]">Equipo de IA Generado:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {teamResult.teamMembers.map((member, index) => (
                            <div key={index} className="bg-[#0A0A0A] rounded-lg p-4 border border-[#8B7355]/20">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">{member.emoji}</span>
                                <div>
                                  <h5 className="font-medium text-[#8B7355]">{member.name}</h5>
                                  <p className="text-xs text-gray-400">{member.label}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-300 mb-2">{member.description}</p>
                              <p className="text-xs text-gray-400 italic">{member.prompt_ready_to_use}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'cadaver' && (
            <motion.div
              key="cadaver"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CadaverExquisito />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 