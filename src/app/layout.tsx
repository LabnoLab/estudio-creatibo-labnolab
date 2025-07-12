'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Palette, TrendingUp, Users, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Navegación principal
const navigation = [
  { name: 'Hub Central', href: '/', icon: Home },
  { name: 'Estudio Creativo', href: '/referencias', icon: Palette },
  { name: 'Radar de Futuros', href: '/radar', icon: TrendingUp, comingSoon: true },
  { name: 'Team Building', href: '/teambuilding', icon: Users, comingSoon: true },
]

// Función para generar breadcrumbs
function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ name: 'Hub Central', href: '/' }]
  
  if (segments.length > 0) {
    switch (segments[0]) {
      case 'referencias':
        breadcrumbs.push({ name: 'Estudio Creativo', href: '/referencias' })
        break
      case 'radar':
        breadcrumbs.push({ name: 'Radar de Futuros', href: '/radar' })
        break
      case 'teambuilding':
        breadcrumbs.push({ name: 'Team Building', href: '/teambuilding' })
        break
    }
  }
  
  return breadcrumbs
}

function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <>
      {/* Header de Navegación */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#E55A2B] to-[#D4502A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">LabnoLab</span>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <div key={item.name} className="relative">
                    <Link
                      href={item.comingSoon ? '#' : item.href}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2
                        ${isActive 
                          ? 'bg-[#E55A2B] text-white' 
                          : item.comingSoon
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:text-[#E55A2B] hover:bg-[#E55A2B]/5'
                        }
                      `}
                      onClick={(e) => item.comingSoon && e.preventDefault()}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.comingSoon && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-1">
                          Pronto
                        </span>
                      )}
                    </Link>
                  </div>
                )
              })}
            </nav>

            {/* Botón menú móvil */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-[#E55A2B] hover:bg-[#E55A2B]/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '#' : item.href}
                    className={`
                      block px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3
                      ${isActive 
                        ? 'bg-[#E55A2B] text-white' 
                        : item.comingSoon
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:text-[#E55A2B] hover:bg-[#E55A2B]/5'
                      }
                    `}
                    onClick={(e) => {
                      if (item.comingSoon) e.preventDefault()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {item.comingSoon && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-auto">
                        Pronto
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </header>

      {/* Breadcrumbs */}
      {pathname !== '/' && (
        <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3">
              {getBreadcrumbs(pathname).map((breadcrumb, index, array) => (
                <div key={breadcrumb.href} className="flex items-center space-x-2">
                  <Link
                    href={breadcrumb.href}
                    className={`text-sm transition-colors ${
                      index === array.length - 1
                        ? 'text-[#E55A2B] font-medium'
                        : 'text-gray-600 hover:text-[#E55A2B]'
                    }`}
                  >
                    {breadcrumb.name}
                  </Link>
                  {index < array.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
