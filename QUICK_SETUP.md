# ⚡ Configuración Rápida de Supabase

## 🚨 Problemas Detectados

Si ves errores en la consola o mensajes de "Error desconocido", es porque las tablas de Supabase no están configuradas. Sigue estos pasos para solucionarlo:

## 📋 Pasos Rápidos

### 1. Ir al Dashboard de Supabase
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión y selecciona tu proyecto
- Ve a **SQL Editor** en el menú lateral

### 2. Ejecutar el Script SQL
- Copia todo el contenido del archivo `scripts/supabase-setup.sql`
- Pégalo en el SQL Editor de Supabase
- Haz clic en **Run** para ejecutar

### 3. Crear Buckets de Storage
- Ve a **Storage** en el menú lateral
- Haz clic en **New bucket**
- Crea un bucket llamado `original-files`
- (Opcional) Crea otro bucket llamado `processed-files`

### 4. Configurar Políticas de Storage
En el **SQL Editor**, ejecuta estas políticas:

```sql
-- Para original-files
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## ✅ Verificación

Después de completar estos pasos:
1. Recarga la página del dashboard
2. Los errores deberían desaparecer
3. Las estadísticas deberían mostrar "0" en lugar de errores
4. El perfil debería guardarse correctamente

## 🔧 Si sigues teniendo problemas

1. **Verifica las variables de entorno** en tu archivo `.env.local`
2. **Asegúrate de que las credenciales de Supabase sean correctas**
3. **Revisa la consola del navegador** para errores específicos
4. **Verifica que el proyecto de Supabase esté activo**

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs en la consola del navegador
2. Verifica que todas las tablas se crearon correctamente en Supabase
3. Asegúrate de que las políticas de RLS estén habilitadas
