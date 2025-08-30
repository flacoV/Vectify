import { FileText, Image, Zap, Shield, Download, Smartphone } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'OCR Inteligente',
    description: 'Reconocimiento óptico de caracteres avanzado para escritura manuscrita con precisión del 99.5%.',
    color: 'text-blue-600'
  },
  {
    icon: Image,
    title: 'Vectorización Automática',
    description: 'Convierte dibujos e ilustraciones en vectores escalables y archivos PNG transparentes.',
    color: 'text-purple-600'
  },
  {
    icon: Zap,
    title: 'Procesamiento Rápido',
    description: 'Resultados en menos de 30 segundos gracias a nuestra infraestructura optimizada.',
    color: 'text-orange-600'
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    description: 'Tus archivos están protegidos con encriptación de extremo a extremo y se eliminan automáticamente.',
    color: 'text-green-600'
  },
  {
    icon: Download,
    title: 'Múltiples Formatos',
    description: 'Exporta en TXT, SVG, PNG y más. Compatible con todas las herramientas de diseño.',
    color: 'text-red-600'
  },
  {
    icon: Smartphone,
    title: 'Acceso Móvil',
    description: 'Interfaz optimizada para móviles con captura de cámara integrada.',
    color: 'text-indigo-600'
  }
]

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 select-none">
            Características potentes para digitalización profesional
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto select-none">
            Todo lo que necesitas para convertir tus manuscritos y dibujos en formato digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="select-none p-6 bg-card rounded-lg border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Flujo de trabajo simple</h3>
            <p className="text-muted-foreground">
              Tres pasos para digitalizar tus documentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Sube tu imagen</h4>
              <p className="text-muted-foreground">
                Captura con la cámara o sube desde tu dispositivo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Procesamiento IA</h4>
              <p className="text-muted-foreground">
                Nuestra IA analiza y procesa automáticamente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Descarga resultados</h4>
              <p className="text-muted-foreground">
                Obtén tus archivos en el formato que necesites
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
