'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Image, Download, Eye, Trash2, Clock, CheckCircle, XCircle, Loader2, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useDigitalization } from '@/lib/hooks/useDigitalization'
import { useApp } from '@/components/providers'
import { toast } from 'react-hot-toast'
import type { Database } from '@/types/supabase'

type Digitalization = Database['public']['Tables']['digitalizations']['Row']

export function HistorySection() {
  const { getDigitalizationHistory } = useDigitalization()
  const { historyVersion, supabase } = useApp()
  const [history, setHistory] = useState<Digitalization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Digitalization | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getDigitalizationHistory()
        setHistory(data)
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [getDigitalizationHistory, historyVersion])

  const handleViewResult = async (item: Digitalization) => {
    console.log('Abriendo modal para item:', {
      id: item.id,
      original_url: item.original_url,
      png_url: item.png_url,
      vector_url: item.vector_url,
      text_content: item.text_content ? 'Sí' : 'No'
    })

    // Intentar generar URLs firmadas si las públicas no funcionan
    let updatedItem = { ...item }

    try {
             // Verificar si la URL original es accesible
       // Si la URL ya tiene token, es una URL firmada, no intentar generar otra
       if (item.original_url.includes('?token=')) {
         console.log('URL original ya es firmada, usando directamente')
       } else {
         const originalResponse = await fetch(item.original_url, { method: 'HEAD' })
         if (!originalResponse.ok) {
         console.log('URL original no accesible, generando URL firmada...')
         console.log('URL original:', item.original_url)
         
         // Extraer el path del archivo de la URL
         let filePath: string
         try {
           const urlParts = item.original_url.split('/')
           console.log('URL parts:', urlParts)
           
           // Buscar el índice después de 'original-files' o 'processed-files'
           const bucketIndex = urlParts.findIndex(part => part === 'original-files' || part === 'processed-files')
           if (bucketIndex !== -1 && bucketIndex + 2 < urlParts.length) {
             const userId = urlParts[bucketIndex + 1]
             const fileName = urlParts[bucketIndex + 2]
             filePath = `${userId}/${fileName}`
           } else {
             // Fallback: intentar extraer de las últimas dos partes
             const fileName = urlParts[urlParts.length - 1]
             const userId = urlParts[urlParts.length - 2]
             filePath = `${userId}/${fileName}`
           }
           
           console.log('Path extraído:', filePath)
         } catch (error) {
           console.error('Error extrayendo path:', error)
           return // No podemos generar URL firmada sin el path
         }
         
         const { data: signedUrl } = await supabase.storage
           .from('original-files')
           .createSignedUrl(filePath, 3600)
         
                    if (signedUrl) {
             updatedItem.original_url = signedUrl.signedUrl
             console.log('URL firmada generada para original:', signedUrl.signedUrl)
           }
         }
       }

             // Verificar si la URL procesada es accesible
       if (item.png_url && item.png_url !== item.original_url) {
         // Si la URL ya tiene token, es una URL firmada, no intentar generar otra
         if (item.png_url.includes('?token=')) {
           console.log('URL procesada ya es firmada, usando directamente')
         } else {
           const processedResponse = await fetch(item.png_url, { method: 'HEAD' })
           if (!processedResponse.ok) {
             console.log('URL procesada no accesible, generando URL firmada...')
             console.log('URL procesada:', item.png_url)
             
             // Similar lógica para la imagen procesada
             let filePath: string
             try {
               const urlParts = item.png_url.split('/')
               console.log('URL procesada parts:', urlParts)
               
               // Buscar el índice después de 'original-files' o 'processed-files'
               const bucketIndex = urlParts.findIndex(part => part === 'original-files' || part === 'processed-files')
               if (bucketIndex !== -1 && bucketIndex + 2 < urlParts.length) {
                 const userId = urlParts[bucketIndex + 1]
                 const fileName = urlParts[bucketIndex + 2]
                 filePath = `${userId}/${fileName}`
               } else {
                 // Fallback: intentar extraer de las últimas dos partes
                 const fileName = urlParts[urlParts.length - 1]
                 const userId = urlParts[urlParts.length - 2]
                 filePath = `${userId}/${fileName}`
               }
               
               console.log('Path procesado extraído:', filePath)
             } catch (error) {
               console.error('Error extrayendo path procesado:', error)
               return // No podemos generar URL firmada sin el path
             }
             
             const { data: signedUrl } = await supabase.storage
               .from('processed-files')
               .createSignedUrl(filePath, 3600)
             
             if (signedUrl) {
               updatedItem.png_url = signedUrl.signedUrl
               console.log('URL firmada generada para procesada:', signedUrl.signedUrl)
             }
           }
         }
       }
    } catch (error) {
      console.error('Error generando URLs firmadas:', error)
    }

    setSelectedItem(updatedItem)
  }

  const handleDownload = async (item: Digitalization, type: 'text' | 'vector' | 'png') => {
    try {
      let content: string
      let filename: string
      let mimeType: string

      switch (type) {
        case 'text':
          if (!item.text_content) {
            toast.error('No hay contenido de texto disponible')
            return
          }
          content = item.text_content
          filename = `${item.original_filename.replace(/\.[^/.]+$/, '')}_texto.txt`
          mimeType = 'text/plain'
          break
        case 'vector':
          if (!item.vector_url) {
            toast.error('No hay archivo vectorial disponible')
            return
          }
          // Para SVG, descargar directamente
          const link = document.createElement('a')
          link.href = item.vector_url
          link.download = `${item.original_filename.replace(/\.[^/.]+$/, '')}_vector.svg`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          toast.success('Descarga iniciada')
          return
        case 'png':
          if (!item.png_url) {
            toast.error('No hay archivo PNG disponible')
            return
          }
          // Para PNG, descargar directamente
          const pngLink = document.createElement('a')
          pngLink.href = item.png_url
          pngLink.download = `${item.original_filename.replace(/\.[^/.]+$/, '')}_procesado.png`
          document.body.appendChild(pngLink)
          pngLink.click()
          document.body.removeChild(pngLink)
          toast.success('Descarga iniciada')
          return
        default:
          return
      }

      // Para texto, crear blob y descargar
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Descarga completada')
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error('Error al descargar el archivo')
    }
  }

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

      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Cargando historial...</p>
        </div>
      ) : (
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
                        <p className="font-medium text-sm">{item.original_filename}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.text_content && (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                              TXT
                            </span>
                          )}
                          {item.vector_url && (
                            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
                              SVG
                            </span>
                          )}
                          {item.png_url && (
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
                      {formatDate(new Date(item.created_at))}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {(item.file_size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewResult(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {item.status === 'completed' && (
                        <div className="flex items-center space-x-1">
                          {item.text_content && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownload(item, 'text')}
                              title="Descargar texto"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                          {item.vector_url && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownload(item, 'vector')}
                              title="Descargar SVG"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {item.png_url && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownload(item, 'png')}
                              title="Descargar PNG"
                            >
                              <Image className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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
      )}

      {history.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No hay digitalizaciones aún</h4>
          <p className="text-sm text-muted-foreground">
            Comienza subiendo tu primer archivo para verlo aquí
          </p>
        </div>
      )}

      {/* Modal para mostrar resultados */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resultado de digitalización</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {/* Imagen original */}
                 <div>
                   <h4 className="font-medium mb-3">Imagen original</h4>
                   <div className="border rounded-lg overflow-hidden">
                     <img 
                       src={selectedItem.original_url} 
                       alt="Original" 
                       className="w-full h-auto max-h-64 object-contain"
                       onError={(e) => {
                         console.error('Error loading original image:', selectedItem.original_url)
                         e.currentTarget.style.display = 'none'
                         e.currentTarget.nextElementSibling?.classList.remove('hidden')
                       }}
                     />
                     <div className="hidden p-8 text-center text-muted-foreground">
                       <p>No se pudo cargar la imagen original</p>
                       <p className="text-sm mt-2">URL: {selectedItem.original_url}</p>
                     </div>
                   </div>
                 </div>

                {/* Resultados */}
                <div className="space-y-4">
                  {/* Texto extraído */}
                  {selectedItem.text_content && (
                    <div>
                      <h4 className="font-medium mb-2">Texto extraído</h4>
                      <div className="border rounded-lg p-4 bg-muted/30 max-h-48 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {selectedItem.text_content}
                        </pre>
                      </div>
                      <div className="mt-2">
                        <Button 
                          size="sm"
                          onClick={() => handleDownload(selectedItem, 'text')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Descargar texto
                        </Button>
                      </div>
                    </div>
                  )}

                                     {/* Imagen procesada */}
                   {selectedItem.png_url && (
                     <div>
                       <h4 className="font-medium mb-2">Imagen procesada</h4>
                       <div className="border rounded-lg overflow-hidden">
                         <img 
                           src={selectedItem.png_url} 
                           alt="Procesada" 
                           className="w-full h-auto max-h-48 object-contain"
                           onError={(e) => {
                             console.error('Error loading processed image:', selectedItem.png_url)
                             e.currentTarget.style.display = 'none'
                             e.currentTarget.nextElementSibling?.classList.remove('hidden')
                           }}
                         />
                         <div className="hidden p-8 text-center text-muted-foreground">
                           <p>No se pudo cargar la imagen procesada</p>
                           <p className="text-sm mt-2">URL: {selectedItem.png_url}</p>
                         </div>
                       </div>
                       <div className="mt-2">
                         <Button 
                           size="sm"
                           onClick={() => handleDownload(selectedItem, 'png')}
                         >
                           <Image className="w-4 h-4 mr-2" />
                           Descargar PNG
                         </Button>
                       </div>
                     </div>
                   )}

                                     {/* Vector */}
                   {selectedItem.vector_url && (
                     <div>
                       <h4 className="font-medium mb-2">Archivo vectorial</h4>
                       <div className="border rounded-lg p-4 bg-muted/30">
                         <p className="text-sm text-muted-foreground">
                           Archivo SVG disponible para descarga
                         </p>
                       </div>
                       <div className="mt-2">
                         <Button 
                           size="sm"
                           onClick={() => handleDownload(selectedItem, 'vector')}
                         >
                           <Download className="w-4 h-4 mr-2" />
                           Descargar SVG
                         </Button>
                       </div>
                     </div>
                   )}
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Archivo:</span>
                    <p className="font-medium">{selectedItem.original_filename}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium">{getTypeText(selectedItem.type)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tamaño:</span>
                    <p className="font-medium">{(selectedItem.file_size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  {selectedItem.processing_time && (
                    <div>
                      <span className="text-muted-foreground">Tiempo:</span>
                      <p className="font-medium">{selectedItem.processing_time}ms</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
