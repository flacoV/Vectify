'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useApp } from '@/components/providers'
import { Sun, Moon, User, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader() {
  const { theme, setTheme, supabase } = useApp()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getThemeIcon = () => {
    return theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold">Vectify</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium hover:text-primary transition-colors">
              Historial
            </Link>
            <Link href="/dashboard/settings" className="text-sm font-medium hover:text-primary transition-colors">
              Configuración
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {getThemeIcon()}
            </Button>
            
            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Menú de usuario"
              >
                <User className="h-5 w-5" />
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2 z-50">
                  <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)}>
                    <div className="px-4 py-2 text-sm hover:bg-muted flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </div>
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)}>
                    <div className="px-4 py-2 text-sm hover:bg-muted flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </div>
                  </Link>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setUserMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-sm hover:bg-muted flex items-center text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
