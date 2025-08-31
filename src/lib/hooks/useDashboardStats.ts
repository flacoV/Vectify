import { useState, useEffect } from 'react'
import { useApp } from '@/components/providers'
import type { Database } from '@/types/supabase'

type Digitalization = Database['public']['Tables']['digitalizations']['Row']

interface DashboardStats {
  totalDigitalizations: number
  textProcessed: number
  drawingsVectorized: number
  averageProcessingTime: number
  recentDigitalizations: Digitalization[]
  isLoading: boolean
  error: string | null
}

export function useDashboardStats() {
  const { supabase } = useApp()
  const [stats, setStats] = useState<DashboardStats>({
    totalDigitalizations: 0,
    textProcessed: 0,
    drawingsVectorized: 0,
    averageProcessingTime: 0,
    recentDigitalizations: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }))

      // Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Verificar si la tabla digitalizations existe
      try {
        const { data: digitalizations, error: digitalizationsError } = await supabase
          .from('digitalizations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (digitalizationsError) {
          // Si la tabla no existe, usar datos por defecto
          if (digitalizationsError.code === '42P01') { // Table doesn't exist
            console.log('Tabla digitalizations no existe, usando datos por defecto')
            setStats({
              totalDigitalizations: 0,
              textProcessed: 0,
              drawingsVectorized: 0,
              averageProcessingTime: 0,
              recentDigitalizations: [],
              isLoading: false,
              error: null
            })
            return
          }
          throw digitalizationsError
        }

        // Calcular estadísticas
        const totalDigitalizations = digitalizations?.length || 0
        const textProcessed = digitalizations?.filter(d => d.type === 'text' && d.status === 'completed').length || 0
        const drawingsVectorized = digitalizations?.filter(d => d.type === 'drawing' && d.status === 'completed').length || 0
        
        const completedDigitalizations = digitalizations?.filter(d => d.status === 'completed' && d.processing_time) || []
        const averageProcessingTime = completedDigitalizations.length > 0 
          ? completedDigitalizations.reduce((acc, d) => acc + (d.processing_time || 0), 0) / completedDigitalizations.length
          : 0

        const recentDigitalizations = digitalizations?.slice(0, 5) || []

        setStats({
          totalDigitalizations,
          textProcessed,
          drawingsVectorized,
          averageProcessingTime: Math.round(averageProcessingTime),
          recentDigitalizations,
          isLoading: false,
          error: null
        })

      } catch (tableError) {
        console.error('Error con la tabla digitalizations:', tableError)
        // Si hay error con la tabla, usar datos por defecto
        setStats({
          totalDigitalizations: 0,
          textProcessed: 0,
          drawingsVectorized: 0,
          averageProcessingTime: 0,
          recentDigitalizations: [],
          isLoading: false,
          error: null
        })
      }

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }))
    }
  }

  const refreshStats = () => {
    fetchStats()
  }

  return {
    ...stats,
    refreshStats
  }
}
