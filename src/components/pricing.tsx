'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Gratis',
    price: '€0',
    period: '/mes',
    description: 'Perfecto para empezar',
    features: [
      '5 digitalizaciones por mes',
      'OCR básico',
      'Formatos: TXT, PNG',
      'Soporte por email',
      'Almacenamiento: 100MB'
    ],
    popular: false,
    cta: 'Comenzar gratis'
  },
  {
    name: 'Pro',
    price: '€19',
    period: '/mes',
    description: 'Para uso profesional',
    features: [
      '100 digitalizaciones por mes',
      'OCR avanzado',
      'Vectorización automática',
      'Formatos: TXT, SVG, PNG',
      'Soporte prioritario',
      'Almacenamiento: 10GB',
      'API access',
      'Sin marca de agua'
    ],
    popular: true,
    cta: 'Comenzar prueba gratis'
  },
  {
    name: 'Enterprise',
    price: '€99',
    period: '/mes',
    description: 'Para equipos grandes',
    features: [
      'Digitalizaciones ilimitadas',
      'OCR premium',
      'Vectorización avanzada',
      'Todos los formatos',
      'Soporte 24/7',
      'Almacenamiento: 100GB',
      'API completa',
      'Integración personalizada',
      'Dashboard de equipo',
      'Analytics avanzados'
    ],
    popular: false,
    cta: 'Contactar ventas'
  }
]

export function Pricing() {
  const router = useRouter()

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Gratis') {
      // Para el plan gratuito, redirigir al dashboard
      router.push('/dashboard')
    } else {
      // Para planes de pago, redirigir al checkout
      router.push('/checkout')
    }
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planes simples y transparentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin costos ocultos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/50' 
                : 'border-gray-200 dark:border-gray-700 bg-card'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-primary-600 hover:bg-primary-700' 
                    : 'bg-secondary-600 hover:bg-secondary-700'
                }`}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Métodos de Pago */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">Métodos de pago aceptados</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-lg">💳</span>
              <span>Tarjetas de crédito/débito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💙</span>
              <span>PayPal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🟡</span>
              <span>Mercado Pago</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-8">¿Tienes preguntas?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2">¿Puedo cambiar de plan?</h4>
              <p className="text-muted-foreground text-sm">
                Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Hay límite de tamaño de archivo?</h4>
              <p className="text-muted-foreground text-sm">
                El límite es de 50MB por archivo. Para archivos más grandes, contacta con soporte.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Qué formatos soportan?</h4>
              <p className="text-muted-foreground text-sm">
                JPG, PNG, PDF, TIFF y más. Consulta nuestra documentación completa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Mis datos están seguros?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutamente. Usamos encriptación de extremo a extremo y cumplimos con GDPR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
