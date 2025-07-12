'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Palette, 
  Zap, 
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Shield,
  Bell,
  Lightbulb,
  Upload,
  Sparkles,
  Feather
} from 'lucide-react';

interface ApplicationCard {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  accent: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  features: string[];
  route: string;
  status: 'active' | 'maintenance' | 'new';
}

export default function HomePage() {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [referencesCount, setReferencesCount] = useState(0);
  const [promptsImproved, setPromptsImproved] = useState(0);
  const [poemasAnalizados, setPoemasAnalizados] = useState(0);

  // Contar archivos reales en referencias
  useEffect(() => {
    const countReferences = async () => {
      try {
        const response = await fetch('/api/count-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directory: 'referencias' })
        });
        if (response.ok) {
          const data = await response.json();
          setReferencesCount(data.count);
        }
      } catch (error) {
        // Si la API no funciona, usar conteo manual conocido
        setReferencesCount(8);
      }
    };

    // Recuperar prompts mejorados del localStorage
    const savedPrompts = localStorage.getItem('labnolab-prompts-improved');
    if (savedPrompts) {
      setPromptsImproved(parseInt(savedPrompts, 10));
    }

    // Recuperar poemas analizados del localStorage
    const savedPoemas = localStorage.getItem('labnolab-poemas-analizados');
    if (savedPoemas) {
      setPoemasAnalizados(parseInt(savedPoemas, 10));
    }

    countReferences();
  }, []);

  const applications: ApplicationCard[] = [
    {
      id: 'estudio-creativo',
      name: 'Estudio Creativo',
      description: 'Gestiona referencias visuales y potencia tu creatividad con IA',
      icon: Palette,
      color: 'from-orange-500 to-amber-500',
      accent: 'orange',
      stats: [
        { label: 'Referencias', value: referencesCount },
        { label: 'Prompts mejorados', value: promptsImproved },
        { label: 'Categorías', value: referencesCount > 0 ? 'Activas' : 'Ninguna' },
        { label: 'Estado', value: referencesCount > 0 ? 'Con contenido' : 'Vacío' }
      ],
      features: [
        'Galería tipo Pinterest',
        'Mejora de prompts con IA',
        'Organización inteligente',
        'Análisis visual automático'
      ],
      route: '/referencias',
      status: 'active'
    },
    {
      id: 'radar-futuros',
      name: 'Radar de Futuros',
      description: 'Análisis predictivo y detección de tendencias emergentes',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      accent: 'blue',
      stats: [
        { label: 'Análisis', value: 0 },
        { label: 'Tendencias', value: 0 },
        { label: 'Precisión', value: 'N/A' },
        { label: 'Estado', value: 'Preparado' }
      ],
      features: [
        'IA de análisis avanzado',
        'Dashboard analítico',
        'Métricas en tiempo real',
        'Alertas inteligentes'
      ],
      route: '/radar',
      status: 'active'
    },
    {
      id: 'team-building',
      name: 'Team Building',
      description: 'Fortalece la colaboración y sinergia de tus equipos',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      accent: 'green',
      stats: [
        { label: 'Equipos', value: 0 },
        { label: 'Perfiles', value: 0 },
        { label: 'Proyectos', value: 0 },
        { label: 'Estado', value: 'Preparado' }
      ],
      features: [
        'Análisis de dinámicas',
        'Cadáver Exquisito',
        'Métricas de colaboración',
        'IA colaborativa'
      ],
      route: '/teambuilding',
      status: 'active'
    },
    {
      id: 'analizador-poesia',
      name: 'Analizador de Poesía',
      description: 'Análisis lingüístico forense de textos poéticos',
      icon: Feather,
      color: 'from-purple-500 to-violet-600',
      accent: 'purple',
      stats: [
        { label: 'Poemas analizados', value: poemasAnalizados },
        { label: 'Figuras detectadas', value: poemasAnalizados > 0 ? 'Múltiples' : 'Ninguna' },
        { label: 'Períodos identificados', value: poemasAnalizados > 0 ? 'Varios' : 'Ninguno' },
        { label: 'Estado', value: 'Preparado' }
      ],
      features: [
        'Análisis métrico y rítmico',
        'Detección de figuras retóricas',
        'Perfil emocional del texto',
        'Huella dactilar lingüística'
      ],
      route: '/poesia',
      status: 'active'
    }
  ];

  const quickActions = [
    { icon: Upload, label: 'Subir Imagen', description: 'Agregar nueva referencia visual', action: () => {} },
    { icon: Brain, label: 'Nuevo Análisis', description: 'Iniciar análisis de tendencias', action: () => {} },
    { icon: Users, label: 'Crear Equipo', description: 'Configurar nuevo equipo', action: () => {} },
    { icon: Sparkles, label: 'Cadáver Exquisito', description: 'Iniciar actividad colaborativa', action: () => {} }
  ];

  const systemStatus = [
    { component: 'API Principal', status: 'online', latency: '45ms', color: 'text-green-600' },
    { component: 'Motor de IA', status: 'online', latency: '128ms', color: 'text-green-600' },
    { component: 'Base de Datos', status: 'online', latency: '12ms', color: 'text-green-600' },
    { component: 'Almacenamiento', status: 'online', latency: '8ms', color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-blue-50 to-green-50 opacity-60"></div>
        <div className="relative px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Hub Central
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Plataforma integral de herramientas creativas, análisis predictivo 
                y colaboración en equipo potenciadas por inteligencia artificial
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Sistema Operativo</span>
                </div>
                <div className="text-gray-400">•</div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Uptime: 99.9%</span>
                </div>
                <div className="text-gray-400">•</div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">1 usuario activo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Applications Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Aplicaciones del Hub
              </h2>
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Zap className="h-4 w-4" />
                <span>Acciones Rápidas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {applications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                  onMouseEnter={() => setSelectedApp(app.id)}
                  onMouseLeave={() => setSelectedApp(null)}
                >
                  {/* App Header */}
                  <div className={`p-6 bg-gradient-to-r ${app.color} text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <app.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{app.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-2 h-2 ${
                              app.status === 'active' ? 'bg-green-400' :
                              app.status === 'maintenance' ? 'bg-yellow-400' :
                              'bg-blue-400'
                            } rounded-full`}></div>
                            <span className="text-sm text-white/80 capitalize">{app.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <a
                          href={app.route}
                          className="inline-flex items-center space-x-1 text-white/80 hover:text-white transition-colors group-hover:translate-x-1 transform duration-200"
                        >
                          <span className="text-sm">Abrir</span>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {app.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {app.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center p-3 bg-gray-50 rounded-xl">
                          <div className="text-lg font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Características clave:
                      </h4>
                      {app.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            app.accent === 'orange' ? 'bg-orange-500' :
                            app.accent === 'blue' ? 'bg-blue-500' :
                            app.accent === 'purple' ? 'bg-purple-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <a
                      href={app.route}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        app.accent === 'orange' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        app.accent === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                        app.accent === 'purple' ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                        'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      <Play className="h-4 w-4" />
                      <span>Comenzar</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Actions Panel */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Acciones Rápidas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={action.action}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <action.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{action.label}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* System Status */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Estado del Sistema
                </h3>
                <div className="space-y-3">
                  {systemStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">{item.component}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500">{item.latency}</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  Estado de las Aplicaciones
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Estudio Creativo</p>
                      <p className="text-xs text-gray-500">{referencesCount} referencias cargadas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Radar de Futuros</p>
                      <p className="text-xs text-gray-500">Preparado para análisis</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Team Building</p>
                      <p className="text-xs text-gray-500">Preparado para colaboración</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Analizador de Poesía</p>
                      <p className="text-xs text-gray-500">{poemasAnalizados} poemas analizados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Getting Started */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-orange-50 via-blue-50 to-green-50 rounded-2xl border border-gray-200 p-8"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Nuevo en LabnoLab?
              </h3>
              <p className="text-gray-600 mb-6">
                Descubre todo el potencial de nuestra plataforma. Comienza con una de estas acciones
                para explorar las capacidades de cada aplicación.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-3">
                <a
                  href="/referencias"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                >
                  <Palette className="h-4 w-4" />
                  <span>Explorar Estudio</span>
                </a>
                <a
                  href="/radar"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                >
                  <Brain className="h-4 w-4" />
                  <span>Analizar Tendencias</span>
                </a>
                <a
                  href="/teambuilding"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                >
                  <Users className="h-4 w-4" />
                  <span>Crear Equipo</span>
                </a>
                <a
                  href="/poesia"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
                >
                  <Feather className="h-4 w-4" />
                  <span>Analizar Poesía</span>
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
