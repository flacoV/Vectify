'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/dashboard/header'
import { useApp } from '@/components/providers'
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Trash2, 
  Download,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, setTheme, supabase } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingNotifications: true,
    autoDownload: false
  })

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleExportData = async () => {
    try {
      setIsLoading(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Obtener todas las digitalizaciones del usuario
      const { data: digitalizations, error } = await supabase
        .from('digitalizations')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      // Crear archivo de exportación
      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        digitalizations: digitalizations || [],
        export_date: new Date().toISOString()
      }

      // Descargar archivo
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vectify-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Datos exportados correctamente')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Error al exportar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setIsLoading(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Eliminar datos del usuario
      const { error: deleteError } = await supabase
        .from('digitalizations')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      // Eliminar perfil del usuario
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (profileError) {
        throw profileError
      }

      // Eliminar cuenta de autenticación
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (authError) {
        // Si no tenemos permisos de admin, al menos cerramos sesión
        await supabase.auth.signOut()
      }

      toast.success('Cuenta eliminada correctamente')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Error al eliminar la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus preferencias y configuración de cuenta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preferencias de la aplicación */}
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold">Preferencias</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Tema oscuro</h3>
                      <p className="text-sm text-muted-foreground">
                        Cambiar entre tema claro y oscuro
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleThemeToggle}
                      className="w-12 h-8"
                    >
                      {theme === 'light' ? (
                        <ToggleLeft className="w-5 h-5" />
                      ) : (
                        <ToggleRight className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificaciones por email</h3>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificaciones por correo electrónico
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSettingToggle('emailNotifications')}
                      className="w-12 h-8"
                    >
                      {settings.emailNotifications ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificaciones de procesamiento</h3>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando se complete una digitalización
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSettingToggle('processingNotifications')}
                      className="w-12 h-8"
                    >
                      {settings.processingNotifications ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Descarga automática</h3>
                      <p className="text-sm text-muted-foreground">
                        Descargar archivos automáticamente al completar
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSettingToggle('autoDownload')}
                      className="w-12 h-8"
                    >
                      {settings.autoDownload ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones de cuenta */}
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-semibold">Cuenta</h2>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExportData}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    Exportar mis datos
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open('/checkout', '_blank')}
                  >
                    <CreditCard className="w-4 h-4 mr-3" />
                    Gestionar suscripción
                  </Button>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-semibold text-red-600">Zona de peligro</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Eliminar cuenta</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Esta acción eliminará permanentemente tu cuenta y todos tus datos.
                      Esta acción no se puede deshacer.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar mi cuenta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
