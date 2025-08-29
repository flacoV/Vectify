import { useState } from 'react'
import { Button } from '@/components/ui/button'

type PaymentMethod = 'paypal'

interface PaymentMethodsProps {
  onPaymentMethodSelect: (method: PaymentMethod) => void
  selectedMethod?: PaymentMethod
  amount: number
  currency?: string
}

const paymentOptions = [
  {
    id: 'paypal' as PaymentMethod,
    name: 'PayPal',
    icon: '💙',
    description: 'Paga con tu cuenta PayPal de forma segura',
    popular: true
  }
]

export function PaymentMethods({ 
  onPaymentMethodSelect, 
  selectedMethod, 
  amount, 
  currency = 'EUR' 
}: PaymentMethodsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (method: PaymentMethod) => {
    setIsProcessing(true)
    try {
      // Aquí se implementaría la lógica de pago específica
      console.log(`Procesando pago con ${method} por ${amount} ${currency}`)
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onPaymentMethodSelect(method)
    } catch (error) {
      console.error('Error en el pago:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Método de pago</h3>
        <p className="text-muted-foreground">
          Total a pagar: <span className="font-semibold">{amount} {currency}</span>
        </p>
      </div>

      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === option.id
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/50'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handlePayment(option.id)}
          >
            {option.popular && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Recomendado
              </span>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h4 className="font-semibold">{option.name}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              
              {isProcessing && selectedMethod === option.id && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>🔒 Todos los pagos están protegidos con encriptación SSL</p>
        <p>💳 Tus datos de pago nunca se almacenan en nuestros servidores</p>
      </div>
    </div>
  )
}

