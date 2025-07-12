'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Palette, TrendingUp, Users, User, Settings, ChevronRight, ChevronDown, Feather } from 'lucide-react'
import { useState } from 'react'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Navegación principal con subsecciones
const navigation = [
  { 
    name: 'Hub Central', 
    href: '/', 
    icon: Home,
    subsections: []
  },
  { 
    name: 'Estudio Creativo', 
    href: '/referencias', 
    icon: Palette,
    subsections: [
      { name: 'Referencias', href: '/referencias' },
      { name: 'Proyectos', href: '/referencias/proyectos' },
      { name: 'Inspiración', href: '/referencias/inspiracion' }
    ]
  },
  { 
    name: 'Radar de Futuros', 
    href: '/radar', 
    icon: TrendingUp,
    subsections: [
      { name: 'Análisis', href: '/radar' },
      { name: 'Tendencias', href: '/radar/tendencias' },
      { name: 'Reportes', href: '/radar/reportes' }
    ]
  },
  { 
    name: 'Team Building', 
    href: '/teambuilding', 
    icon: Users,
    subsections: [
      { name: 'Análisis Individual', href: '/teambuilding' },
      { name: 'Dinámicas', href: '/teambuilding/dinamicas' },
      { name: 'Resultados', href: '/teambuilding/resultados' }
    ]
  },
  { 
    name: 'Analizador de Poesía', 
    href: '/poesia', 
    icon: Feather,
    subsections: [
      { name: 'Análisis Forense', href: '/poesia' },
      { name: 'Biblioteca', href: '/poesia/biblioteca' },
      { name: 'Historial', href: '/poesia/historial' }
    ]
  },
]

function Sidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isSectionExpanded = (sectionName: string) => {
    return expandedSections.includes(sectionName) || 
           navigation.find(nav => nav.name === sectionName)?.subsections.some(sub => pathname.startsWith(sub.href))
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF8A65] to-[#FFB74D] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">LabnoLab</h1>
            <p className="text-xs text-gray-500">Hub Central</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const expanded = isSectionExpanded(item.name)
          
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={`
                    flex-1 flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${active 
                      ? 'bg-[#FF8A65] text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
                
                {item.subsections.length > 0 && (
                  <button
                    onClick={() => toggleSection(item.name)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    {expanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
              </div>

              {/* Subsections */}
              {item.subsections.length > 0 && expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  {item.subsections.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`
                        block px-3 py-2 ml-8 text-sm rounded-lg transition-colors
                        ${pathname === sub.href
                          ? 'bg-[#FF8A65]/10 text-[#FF8A65] font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF8A65] to-[#FFB74D] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Usuario</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

function Header() {
  const pathname = usePathname()
  
  // Generar título basado en la ruta
  const getPageTitle = () => {
    if (pathname === '/') return 'Hub Central'
    if (pathname.startsWith('/referencias')) return 'Estudio Creativo'
    if (pathname.startsWith('/radar')) return 'Radar de Futuros'
    if (pathname.startsWith('/teambuilding')) return 'Team Building'
    if (pathname.startsWith('/poesia')) return 'Analizador de Poesía'
    return 'LabnoLab'
  }
  
  const getPageDescription = () => {
    if (pathname === '/') return 'Bienvenido a tu espacio de trabajo creativo'
    if (pathname.startsWith('/referencias')) return 'Gestiona tus referencias y proyectos creativos'
    if (pathname.startsWith('/radar')) return 'Explora tendencias y futuros emergentes'
    if (pathname.startsWith('/teambuilding')) return 'Fortalece equipos y dinámicas colaborativas'
    if (pathname.startsWith('/poesia')) return 'Análisis lingüístico forense de textos poéticos'
    return 'Plataforma integral para la creatividad y la innovación'
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Todo funcionando</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>LabnoLab - Hub Central</title>
        <meta name="description" content="Plataforma integral para potenciar la creatividad, explorar futuros emergentes y fortalecer equipos de trabajo." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
