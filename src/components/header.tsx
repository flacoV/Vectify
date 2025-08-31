'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useApp } from '@/components/providers'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { theme, setTheme } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    // Solo alternar entre light y dark, eliminar system
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const getThemeIcon = () => {
    return theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold">Vectify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Características
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Precios
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
              Documentación
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {getThemeIcon()}
            </Button>
            
            <Link href="/auth/login">
              <Button variant="ghost">
                Iniciar sesión
              </Button>
            </Link>
            
            <Link href="/auth/register">
              <Button>
                Comenzar gratis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {getThemeIcon()}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/features" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </Link>
              <Link 
                href="/docs" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentación
              </Link>
              <div className="pt-4 border-t">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full mt-2">
                    Comenzar gratis
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
