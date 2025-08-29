// Configuración de métodos de pago para Vectify

export interface PaymentConfig {
  paypal: {
    clientId: string
    clientSecret: string
    webhookId: string
    environment: 'sandbox' | 'production'
  }
}

// Configuración por defecto (desarrollo)
export const paymentConfig: PaymentConfig = {
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production'
  }
}

// URLs de webhook para cada método de pago
export const webhookUrls = {
  paypal: '/api/webhooks/paypal'
}

// Configuración de monedas soportadas
export const supportedCurrencies = ['EUR', 'USD', 'ARS', 'BRL', 'MXN', 'COP']

// Configuración de planes de suscripción
export const subscriptionPlans = {
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    currency: 'EUR',
    interval: 'month',
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
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'EUR',
    interval: 'month',
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
}

// Función para validar la configuración de pagos
export function validatePaymentConfig(): boolean {
  const requiredFields = [
    paymentConfig.paypal.clientId,
    paymentConfig.paypal.clientSecret
  ]

  return requiredFields.every(field => field && field.length > 0)
}

// Función para obtener la configuración de un método de pago específico
export function getPaymentMethodConfig(method: 'paypal') {
  switch (method) {
    case 'paypal':
      return paymentConfig.paypal
    default:
      throw new Error(`Método de pago no soportado: ${method}`)
  }
}

