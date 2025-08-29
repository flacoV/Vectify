import { NextRequest, NextResponse } from 'next/server'
import { paymentConfig } from '@/lib/payment-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = request.headers

    // Verificar que la solicitud viene de PayPal
    const paypalSignature = headers.get('paypal-transmission-sig')
    const paypalCertUrl = headers.get('paypal-cert-url')
    const paypalTransmissionId = headers.get('paypal-transmission-id')
    const paypalTransmissionTime = headers.get('paypal-transmission-time')
    const paypalAuthAlgo = headers.get('paypal-auth-algo')

    if (!paypalSignature || !paypalCertUrl || !paypalTransmissionId || !paypalTransmissionTime || !paypalAuthAlgo) {
      return NextResponse.json({ error: 'Faltan headers de PayPal' }, { status: 400 })
    }

    // Parsear el body como JSON
    const event = JSON.parse(body)

    // Verificar el tipo de evento
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Pago completado exitosamente
        await handlePaymentCompleted(event)
        break
      
      case 'PAYMENT.CAPTURE.DENIED':
        // Pago denegado
        await handlePaymentDenied(event)
        break
      
      case 'BILLING.SUBSCRIPTION.CREATED':
        // Suscripción creada
        await handleSubscriptionCreated(event)
        break
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Suscripción cancelada
        await handleSubscriptionCancelled(event)
        break
      
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Suscripción expirada
        await handleSubscriptionExpired(event)
        break
      
      default:
        console.log(`Evento no manejado: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error en webhook de PayPal:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

async function handlePaymentCompleted(event: any) {
  const paymentId = event.resource.id
  const amount = event.resource.amount.value
  const currency = event.resource.amount.currency_code
  const status = event.resource.status
  
  console.log(`Pago completado: ${paymentId} - ${amount} ${currency}`)
  
  // Aquí implementarías la lógica para:
  // 1. Actualizar el estado del usuario en la base de datos
  // 2. Activar la suscripción
  // 3. Enviar email de confirmación
  // 4. Actualizar el plan del usuario
}

async function handlePaymentDenied(event: any) {
  const paymentId = event.resource.id
  console.log(`Pago denegado: ${paymentId}`)
  
  // Aquí implementarías la lógica para:
  // 1. Notificar al usuario sobre el pago fallido
  // 2. Actualizar el estado en la base de datos
}

async function handleSubscriptionCreated(event: any) {
  const subscriptionId = event.resource.id
  const planId = event.resource.plan_id
  
  console.log(`Suscripción creada: ${subscriptionId} - Plan: ${planId}`)
  
  // Aquí implementarías la lógica para:
  // 1. Crear el registro de suscripción en tu base de datos
  // 2. Asignar el plan al usuario
}

async function handleSubscriptionCancelled(event: any) {
  const subscriptionId = event.resource.id
  
  console.log(`Suscripción cancelada: ${subscriptionId}`)
  
  // Aquí implementarías la lógica para:
  // 1. Desactivar la suscripción del usuario
  // 2. Cambiar al plan gratuito
  // 3. Notificar al usuario
}

async function handleSubscriptionExpired(event: any) {
  const subscriptionId = event.resource.id
  
  console.log(`Suscripción expirada: ${subscriptionId}`)
  
  // Aquí implementarías la lógica para:
  // 1. Desactivar la suscripción
  // 2. Cambiar al plan gratuito
  // 3. Notificar al usuario
}
