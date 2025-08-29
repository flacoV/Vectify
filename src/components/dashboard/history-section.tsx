'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Image, Download, Eye, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Datos de ejemplo para el historial
const mockHistory = [
  {
    id: '1',
    filename: 'manuscrito-1.jpg',
    type: 'text' as const,
    status: 'completed' as const,
    createdAt: new Date('2024-01-15T10:30:00'),
    fileSize: 2.5 * 1024 * 1024, // 2.5MB
    hasText: true,
    hasVector: false,
    hasPng: false
  },
  {
    id: '2',
    filename: 'dibujo-sketch.png',
    type: 'drawing' as const,
    status: 'completed' as const,
    createdAt: new Date('2024-01-14T15:45:00'),
    fileSize: 1.8 * 1024 * 1024, // 1.8MB
    hasText: false,
    hasVector: true,
    hasPng: true
  },
  {
    id: '3',
    filename: 'documento-mixto.pdf',
    type: 'mixed' as const,
    status: 'processing' as const,
    createdAt: new Date('2024-01-15T09:15:00'),
    fileSize: 5.2 * 1024 * 1024, // 5.2MB
    hasText: false,
    hasVector: false,
    hasPng: false
  },
  {
    id: '4',
    filename: 'notas-rapidas.jpg',
    type: 'text' as const,
    status: 'failed' as const,
    createdAt: new Date('2024-01-13T14:20:00'),
    fileSize: 0.8 * 1024 * 1024, // 0.8MB
    hasText: false,
    hasVector: false,
    hasPng: false
  }
]

export function HistorySection() {
  const [history] = useState(mockHistory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'processing':
        return 'Procesando'
      case 'failed':
        return 'Fallido'
      default:
        return 'Desconocido'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />
      case 'drawing':
        return <Image className="w-4 h-4" />
      case 'mixed':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'text':
        return 'Texto'
      case 'drawing':
        return 'Dibujo'
      case 'mixed':
        return 'Mixto'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="bg-card border rounded-lg">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Historial de digitalizaciones</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tus archivos procesados recientemente
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-sm">Archivo</th>
              <th className="text-left p-4 font-medium text-sm">Tipo</th>
              <th className="text-left p-4 font-medium text-sm">Estado</th>
              <th className="text-left p-4 font-medium text-sm">Fecha</th>
              <th className="text-left p-4 font-medium text-sm">Tamaño</th>
              <th className="text-right p-4 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-t hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.filename}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.hasText && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                            TXT
                          </span>
                        )}
                        {item.hasVector && (
                          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
                            SVG
                          </span>
                        )}
                        {item.hasPng && (
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                            PNG
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm">{getTypeText(item.type)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{getStatusText(item.status)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {(item.fileSize / 1024 / 1024).toFixed(1)} MB
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.status === 'completed' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No hay digitalizaciones aún</h4>
          <p className="text-sm text-muted-foreground">
            Comienza subiendo tu primer archivo para verlo aquí
          </p>
        </div>
      )}
    </div>
  )
}
