'use client'

import { useState } from 'react'
import { Checkout } from '@/components/payment/checkout'
import { Pricing } from '@/components/pricing'
import { Header } from '@/components/header'

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: 'mes',
    features: [
      '100 digitalizaciones por mes',
      'OCR avanzado',
      'Vectorización automática',
      'Formatos: TXT, SVG, PNG',
      'Soporte prioritario',
      'Almacenamiento: 10GB',
      'API access',
      'Sin marca de agua'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'mes',
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
    ]
  }
]

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [step, setStep] = useState<'plans' | 'checkout'>('plans')

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan)
    setStep('checkout')
  }

  const handleBack = () => {
    setStep('plans')
    setSelectedPlan(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 'plans' ? (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Elige tu plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Selecciona el plan que mejor se adapte a tus necesidades de digitalización
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="relative p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handlePlanSelect(plan)}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">€{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Seleccionar {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedPlan && (
            <Checkout plan={selectedPlan} onBack={handleBack} />
          )
        )}
      </main>
    </div>
  )
}

