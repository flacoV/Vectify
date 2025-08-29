import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PaymentMethods } from './payment-methods'
import { Check, ArrowLeft, Shield, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'paypal'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
}

interface CheckoutProps {
  plan: Plan
  onBack: () => void
}

export function Checkout({ plan, onBack }: CheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    setSelectedMethod(method)
    setIsProcessing(true)
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simular éxito
      setIsSuccess(true)
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Error en el checkout:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
          <p className="text-muted-foreground">
            Tu suscripción {plan.name} ha sido activada. Redirigiendo al dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Completar suscripción</h1>
          <p className="text-muted-foreground">Plan {plan.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen del plan */}
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Resumen del plan</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Plan {plan.name}</span>
                <span className="font-semibold">{plan.price}€/{plan.period}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>{plan.price}€/{plan.period}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Características incluidas</h3>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Garantía de satisfacción
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Puedes cancelar tu suscripción en cualquier momento sin penalización.
              </p>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="bg-card border rounded-lg p-6">
          <PaymentMethods
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedMethod}
            amount={plan.price}
            currency="EUR"
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>Al completar el pago, aceptas nuestros <a href="/terms" className="underline">Términos de Servicio</a></p>
        <p>Tu suscripción se renovará automáticamente cada {plan.period}</p>
      </div>
    </div>
  )
}

