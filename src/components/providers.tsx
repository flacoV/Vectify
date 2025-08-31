'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

type Theme = 'light' | 'dark'

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  supabase: ReturnType<typeof createClientComponentClient<Database>>
  refreshHistory: () => void
  historyVersion: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const [historyVersion, setHistoryVersion] = useState(0)

  // Manejo del tema
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      // Si no hay tema guardado, usar el tema del sistema
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const refreshHistory = () => {
    setHistoryVersion(prev => prev + 1)
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <AppContext.Provider value={{ 
      theme, 
      setTheme: handleThemeChange, 
      supabase, 
      refreshHistory, 
      historyVersion 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
