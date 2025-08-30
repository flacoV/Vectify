import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL a la que redirigir después del login exitoso
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
