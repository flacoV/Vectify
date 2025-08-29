'use client'

import { FileText, Image, Clock, CheckCircle } from 'lucide-react'

const stats = [
  {
    title: 'Total digitalizaciones',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    title: 'Texto procesado',
    value: '18',
    change: '+8%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'text-green-600'
  },
  {
    title: 'Dibujos vectorizados',
    value: '6',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Image,
    color: 'text-purple-600'
  },
  {
    title: 'Tiempo promedio',
    value: '23s',
    change: '-5%',
    changeType: 'positive' as const,
    icon: Clock,
    color: 'text-orange-600'
  }
]

export function StatsSection() {
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
          <div className="flex items-center mt-4">
            <span className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        </div>
      ))}
    </div>
  )
}
