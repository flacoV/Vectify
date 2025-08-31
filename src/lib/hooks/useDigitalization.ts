import { useState } from 'react'
import { useApp } from '@/components/providers'
import { toast } from 'react-hot-toast'
import type { Database } from '@/types/supabase'

type DigitalizationType = 'text' | 'drawing' | 'mixed'
type Digitalization = Database['public']['Tables']['digitalizations']['Row']

interface ProcessingResult {
  textContent?: string
  vectorUrl?: string
  pngUrl?: string
}

export function useDigitalization() {
  const { supabase } = useApp()
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = async (
    file: File, 
    type: DigitalizationType
  ): Promise<Digitalization | null> => {
    setIsProcessing(true)
    
    try {
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Asegurar que existe un registro en la tabla users
      console.log('Verificando si el usuario existe en la tabla users...')
      try {
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (userCheckError && userCheckError.code === 'PGRST116') {
          // Usuario no existe en la tabla users, crearlo
          console.log('Usuario no existe en tabla users, creando registro...')
          const { error: createUserError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (createUserError) {
            console.error('Error al crear usuario en tabla users:', createUserError)
            throw new Error(`Error al crear usuario: ${createUserError.message}`)
          }
          console.log('Usuario creado exitosamente en tabla users')
        } else if (userCheckError) {
          console.error('Error al verificar usuario:', userCheckError)
          throw new Error(`Error al verificar usuario: ${userCheckError.message}`)
        } else {
          console.log('Usuario ya existe en tabla users')
        }
      } catch (tableError) {
        // Si la tabla users no existe, continuar (ya manejamos esto en otros lugares)
        console.log('Tabla users no existe, continuando...')
      }

      // Subir archivo a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      console.log('Intentando subir archivo a storage:', fileName)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('original-files')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Error al subir archivo:', uploadError)
        throw new Error(`Error al subir el archivo: ${uploadError.message}`)
      }

      console.log('Archivo subido exitosamente:', uploadData)

      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('original-files')
        .getPublicUrl(fileName)

      console.log('URL pública generada:', publicUrl)
      console.log('Detalles de la URL:', {
        fileName,
        bucket: 'original-files',
        fullUrl: publicUrl,
        urlParts: publicUrl.split('/')
      })

      // Verificar que la URL sea accesible y generar URL firmada si es necesario
      let finalUrl = publicUrl
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' })
        if (!response.ok) {
          console.warn('URL pública no accesible, generando URL firmada...')
          // Si la URL pública no funciona, usar URL firmada
          const { data: signedUrl } = await supabase.storage
            .from('original-files')
            .createSignedUrl(fileName, 3600) // 1 hora
          
          if (signedUrl) {
            console.log('URL firmada generada:', signedUrl.signedUrl)
            finalUrl = signedUrl.signedUrl
          }
        }
      } catch (error) {
        console.error('Error verificando URL, usando URL firmada:', error)
        // En caso de error, intentar con URL firmada
        const { data: signedUrl } = await supabase.storage
          .from('original-files')
          .createSignedUrl(fileName, 3600)
        
        if (signedUrl) {
          finalUrl = signedUrl.signedUrl
        }
      }

      // Crear registro en la base de datos
      console.log('Intentando crear registro en digitalizations...', {
        user_id: user.id,
        original_filename: file.name,
        original_url: finalUrl,
        type,
        file_size: file.size,
        status: 'processing'
      })

      const { data: digitalization, error: dbError } = await supabase
        .from('digitalizations')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          original_url: finalUrl,
          type,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single()

      if (dbError) {
        console.error('Error al crear registro:', dbError)
        throw new Error(`Error al crear el registro: ${dbError.message}`)
      }

      // Procesar con OpenAI
      const startTime = Date.now()
      const result = await processWithOpenAI(finalUrl, type)
      const processingTime = Date.now() - startTime

      // Actualizar registro con resultados
      const updateData: any = {
        status: 'completed',
        processing_time: processingTime
      }

      if (result.textContent) {
        updateData.text_content = result.textContent
      }

      if (result.vectorUrl) {
        updateData.vector_url = result.vectorUrl
      }

      if (result.pngUrl) {
        updateData.png_url = result.pngUrl
      }

      const { data: updatedDigitalization, error: updateError } = await supabase
        .from('digitalizations')
        .update(updateData)
        .eq('id', digitalization.id)
        .select()
        .single()

      if (updateError) {
        throw new Error('Error al actualizar el resultado')
      }

      toast.success('Digitalización completada exitosamente')
      return updatedDigitalization

    } catch (error) {
      console.error('Error processing file:', error)
      toast.error(error instanceof Error ? error.message : 'Error al procesar el archivo')
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const processWithOpenAI = async (
    imageUrl: string, 
    type: DigitalizationType
  ): Promise<ProcessingResult> => {
    try {
      console.log('Llamando a OpenAI API con:', { imageUrl, type })
      
      const response = await fetch('/api/process-digitalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          type
        })
      })

      console.log('Respuesta de OpenAI API:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error en OpenAI API:', errorText)
        throw new Error(`Error en el procesamiento con IA: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Resultado de OpenAI:', result)
      return result
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      throw error
    }
  }

  const getDigitalizationHistory = async (): Promise<Digitalization[]> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      try {
        const { data: digitalizations, error } = await supabase
          .from('digitalizations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          // Si la tabla no existe, devolver array vacío
          if (error.code === '42P01') {
            console.log('Tabla digitalizations no existe, devolviendo historial vacío')
            return []
          }
          throw error
        }

        return digitalizations || []
      } catch (tableError) {
        console.error('Error con la tabla digitalizations:', tableError)
        return []
      }
    } catch (error) {
      console.error('Error fetching digitalization history:', error)
      return []
    }
  }

  return {
    isProcessing,
    processFile,
    getDigitalizationHistory
  }
}
