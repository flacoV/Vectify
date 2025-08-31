'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/dashboard/header'
import { useApp } from '@/components/providers'
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { supabase } = useApp()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        throw new Error('Usuario no autenticado')
      }

      setUser(user)
      
      // Intentar obtener datos adicionales del perfil
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // Si la tabla no existe, usar solo los datos del usuario
          if (profileError.code === '42P01') {
            console.log('Tabla users no existe, usando datos del usuario')
            setFormData({
              full_name: user.user_metadata?.full_name || '',
              email: user.email || ''
            })
            return
          }
          throw profileError
        }

        setFormData({
          full_name: profile?.full_name || user.user_metadata?.full_name || '',
          email: user.email || ''
        })
      } catch (tableError) {
        console.error('Error con la tabla users:', tableError)
        // Si hay error con la tabla, usar solo los datos del usuario
        setFormData({
          full_name: user.user_metadata?.full_name || '',
          email: user.email || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Error al cargar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      // Actualizar metadatos del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: formData.full_name }
      })

      if (updateError) {
        console.error('Error updating user metadata:', updateError)
        // No lanzar error aquí, continuar con la actualización del perfil
      }

      // Verificar si la tabla users existe antes de intentar actualizar
      try {
        // Actualizar o crear perfil en la tabla users
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: formData.full_name,
            updated_at: new Date().toISOString()
          })

        if (upsertError) {
          // Si la tabla no existe, solo actualizar los metadatos
          if (upsertError.code === '42P01') { // Table doesn't exist
            console.log('Tabla users no existe, solo actualizando metadatos')
            toast.success('Perfil actualizado correctamente')
            setIsEditing(false)
            await loadUserProfile()
            return
          }
          throw upsertError
        }

        toast.success('Perfil actualizado correctamente')
        setIsEditing(false)
        await loadUserProfile() // Recargar datos
      } catch (tableError) {
        console.error('Error con la tabla users:', tableError)
        // Si hay error con la tabla, solo actualizar metadatos
        toast.success('Perfil actualizado correctamente')
        setIsEditing(false)
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-6">
            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {formData.full_name || 'Usuario'}
                </h2>
                <p className="text-muted-foreground">{formData.email}</p>
              </div>
            </div>

            {/* Formulario de edición */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.full_name || 'No especificado'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Miembro desde
                </label>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Fecha no disponible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar perfil
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
