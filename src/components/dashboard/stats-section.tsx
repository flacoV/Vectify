'use client'

import { FileText, Image, Clock, Loader2 } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'

export function StatsSection() {
  const { 
    totalDigitalizations, 
    textProcessed, 
    drawingsVectorized, 
    averageProcessingTime,
    isLoading,
    error 
  } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-600 dark:text-red-400">Error al cargar estadísticas: {error}</p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total digitalizaciones',
      value: totalDigitalizations.toString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Texto procesado',
      value: textProcessed.toString(),
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Dibujos vectorizados',
      value: drawingsVectorized.toString(),
      icon: Image,
      color: 'text-purple-600'
    },
    {
      title: 'Tiempo promedio',
      value: averageProcessingTime > 0 ? `${averageProcessingTime}s` : 'N/A',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
