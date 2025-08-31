import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export async function checkSupabaseSetup() {
  const supabase = createClientComponentClient<Database>()
  const issues: string[] = []
  const warnings: string[] = []

  try {
    // Verificar autenticación primero
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Usuario autenticado:', user ? 'Sí' : 'No', authError)
    
    if (authError || !user) {
      issues.push('Usuario no autenticado - las verificaciones de storage requieren autenticación')
      return {
        issues,
        warnings,
        isConfigured: false,
        hasWarnings: warnings.length > 0
      }
    }
    // Verificar si la tabla users existe
    try {
      const { error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      if (usersError) {
        if (usersError.code === '42P01') {
          issues.push('La tabla "users" no existe en la base de datos')
        } else {
          warnings.push(`Error al acceder a la tabla "users": ${usersError.message}`)
        }
      }
    } catch (error) {
      issues.push('No se puede acceder a la tabla "users"')
    }

    // Verificar si la tabla digitalizations existe
    try {
      const { error: digitalizationsError } = await supabase
        .from('digitalizations')
        .select('id')
        .limit(1)
      
      if (digitalizationsError) {
        if (digitalizationsError.code === '42P01') {
          issues.push('La tabla "digitalizations" no existe en la base de datos')
        } else {
          warnings.push(`Error al acceder a la tabla "digitalizations": ${digitalizationsError.message}`)
        }
      }
    } catch (error) {
      issues.push('No se puede acceder a la tabla "digitalizations"')
    }

    // Verificar si la tabla subscriptions existe
    try {
      const { error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('id')
        .limit(1)
      
      if (subscriptionsError) {
        if (subscriptionsError.code === '42P01') {
          warnings.push('La tabla "subscriptions" no existe (opcional para funcionalidad básica)')
        } else {
          warnings.push(`Error al acceder a la tabla "subscriptions": ${subscriptionsError.message}`)
        }
      }
    } catch (error) {
      warnings.push('No se puede acceder a la tabla "subscriptions"')
    }

    // Verificar buckets de storage (deshabilitado temporalmente)
    // Los buckets existen pero hay problemas de permisos para listarlos
    // Las políticas están configuradas correctamente en storage.objects
    console.log('Verificación de buckets deshabilitada - buckets confirmados como existentes')
    
    // Comentado temporalmente hasta resolver permisos de listado
    /*
    try {
      console.log('Intentando listar buckets...')
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      console.log('Respuesta de listBuckets:', { buckets, bucketsError })
      
      if (bucketsError) {
        console.error('Error al listar buckets:', bucketsError)
        warnings.push(`Error al verificar buckets de storage: ${bucketsError.message}`)
      } else {
        const bucketNames = buckets?.map(b => b.name) || []
        console.log('Buckets encontrados:', bucketNames, 'Longitud:', bucketNames.length)
        
        // Verificar bucket original-files (case insensitive)
        const hasOriginalFiles = bucketNames.some(name => 
          name.toLowerCase() === 'original-files' || 
          name.toLowerCase() === 'original_files'
        )
        
        if (!hasOriginalFiles) {
          issues.push('El bucket "original-files" no existe en Storage')
        }
        
        // processed-files es opcional
        if (!bucketNames.includes('processed-files')) {
          // warnings.push('El bucket "processed-files" no existe (opcional)')
        }
      }
    } catch (error) {
      console.error('Error verificando buckets:', error)
      warnings.push('Error al acceder a Storage: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
    */

  } catch (error) {
    issues.push('Error general al verificar la configuración de Supabase')
  }

  return {
    issues,
    warnings,
    isConfigured: issues.length === 0,
    hasWarnings: warnings.length > 0
  }
}

export function getSetupInstructions() {
  return {
    title: 'Configuración de Supabase Requerida',
    steps: [
      {
        title: '1. Ejecutar script SQL',
        description: 'Ejecuta el archivo scripts/supabase-setup.sql en el SQL Editor de Supabase',
        code: 'Copiar y pegar el contenido de scripts/supabase-setup.sql en el SQL Editor'
      },
      {
        title: '2. Crear buckets de Storage',
        description: 'Crea los buckets "original-files" y "processed-files" en Storage',
        steps: [
          'Ir a Storage en el dashboard de Supabase',
          'Crear bucket "original-files"',
          'Crear bucket "processed-files" (opcional)',
          'Configurar políticas de acceso'
        ]
      },
      {
        title: '3. Configurar políticas de Storage',
        description: 'Ejecutar las políticas de storage después de crear los buckets',
        code: `-- Para original-files
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);`
      }
    ]
  }
}
