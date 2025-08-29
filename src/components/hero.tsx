import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Camera, Upload, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary-50/20 dark:to-primary-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Potenciado por IA
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Digitaliza{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              manuscritos
            </span>{' '}
            y dibujos con{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              inteligencia artificial
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Convierte escrituras manuscritas en texto editable y transforma dibujos en vectores limpios. 
            Procesamiento rápido y preciso con tecnología de vanguardia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Ver demo
              </Button>
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Captura desde móvil</h3>
                <p className="text-muted-foreground">
                  Toma fotos directamente con tu cámara y procesa al instante
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Sube desde PC</h3>
                <p className="text-muted-foreground">
                  Arrastra y suelta archivos o selecciona desde tu dispositivo
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">99.5%</div>
              <div className="text-sm text-muted-foreground">Precisión OCR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">&lt;30s</div>
              <div className="text-sm text-muted-foreground">Tiempo de procesamiento</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">50+</div>
              <div className="text-sm text-muted-foreground">Formatos soportados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}
