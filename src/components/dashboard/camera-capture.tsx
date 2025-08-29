'use client'

import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Camera, RotateCcw, X } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        // Convertir base64 a File
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            onCapture(file)
          })
      }
    }
  }, [onCapture])

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Capturar imagen</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-64 object-cover"
          />
          
          {/* Camera Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={switchCamera}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={capture}
              size="icon"
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100"
            >
              <Camera className="w-8 h-8 text-gray-800" />
            </Button>
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Posiciona tu documento en el centro de la pantalla
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={capture} className="flex-1">
              Capturar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
