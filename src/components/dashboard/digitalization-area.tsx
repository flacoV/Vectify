'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Camera, Upload, FileText, Image, Loader2 } from 'lucide-react'
import { CameraCapture } from './camera-capture'
import { toast } from 'react-hot-toast'

type DigitalizationType = 'text' | 'drawing' | 'mixed'

export function DigitalizationArea() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedType, setSelectedType] = useState<DigitalizationType>('text')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validar tipo y tamaño
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      const maxSize = 50 * 1024 * 1024 // 50MB

      if (!validTypes.includes(file.type)) {
        toast.error('Formato de archivo no soportado. Usa JPG, PNG, WebP o PDF.')
        return
      }

      if (file.size > maxSize) {
        toast.error('El archivo es demasiado grande. Máximo 50MB.')
        return
      }

      setSelectedFile(file)
      toast.success('Archivo seleccionado correctamente')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error('Por favor selecciona un archivo primero')
      return
    }

    setIsProcessing(true)
    try {
      // Aquí iría la lógica de procesamiento con la API
      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulación
      toast.success('Digitalización completada exitosamente')
      setSelectedFile(null)
    } catch (error) {
      toast.error('Error al procesar el archivo')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file)
    setShowCamera(false)
    toast.success('Imagen capturada correctamente')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Digitaliza tu contenido</h2>
        <p className="text-muted-foreground">
          Sube una imagen o captura con la cámara para comenzar
        </p>
      </div>

      {/* Type Selection */}
      <div className="flex justify-center space-x-4">
        {(['text', 'drawing', 'mixed'] as DigitalizationType[]).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            onClick={() => setSelectedType(type)}
            className="capitalize"
          >
            {type === 'text' && <FileText className="w-4 h-4 mr-2" />}
            {type === 'drawing' && <Image className="w-4 h-4 mr-2" />}
            {type === 'mixed' && <FileText className="w-4 h-4 mr-2" />}
            {type === 'text' && 'Texto'}
            {type === 'drawing' && 'Dibujo'}
            {type === 'mixed' && 'Mixto'}
          </Button>
        ))}
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Subir archivo</h3>
          <p className="text-muted-foreground mb-4">
            Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
          </p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, WebP, PDF • Máximo 50MB
          </p>
        </div>

        {/* Camera Capture */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Capturar con cámara</h3>
          <p className="text-muted-foreground mb-4">
            Toma una foto directamente desde tu dispositivo
          </p>
          <Button
            onClick={() => setShowCamera(true)}
            variant="outline"
            className="w-full"
          >
            Abrir cámara
          </Button>
        </div>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Procesar'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
