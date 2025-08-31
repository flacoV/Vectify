# 🚀 Configuración de Vectify

## Funcionalidades Implementadas

### ✅ Dashboard Funcional
- **Estadísticas reales**: Conectado con Supabase para mostrar datos reales de digitalizaciones
- **Procesamiento con IA**: Integración con OpenAI Vision API para OCR y procesamiento de imágenes
- **Historial dinámico**: Muestra el historial real de digitalizaciones del usuario
- **Menú de usuario funcional**: Perfil, configuración y gestión de cuenta

### ✅ Procesamiento de IA
- **OCR con OpenAI**: Extracción de texto de imágenes usando GPT-4 Vision
- **Soporte para múltiples tipos**: Texto, dibujos y contenido mixto
- **Almacenamiento en Supabase**: Archivos originales y procesados
- **Tracking de procesamiento**: Tiempo de procesamiento y estado

### ✅ Gestión de Usuario
- **Perfil editable**: Actualización de información personal
- **Configuración de preferencias**: Tema, notificaciones, descarga automática
- **Exportación de datos**: Descarga de todos los datos del usuario
- **Eliminación de cuenta**: Gestión completa de la cuenta

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```bash
# Supabase (requerido)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (requerido para procesamiento)
OPENAI_API_KEY=your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configuración de Supabase

#### Base de Datos
Asegúrate de tener las siguientes tablas en tu base de datos:

```sql
-- Tabla de usuarios (se crea automáticamente con Supabase Auth)
-- Tabla de digitalizaciones (ya definida en types/supabase.ts)
-- Tabla de suscripciones (ya definida en types/supabase.ts)
```

#### Storage Buckets
Crea los siguientes buckets en Supabase Storage:

1. **`original-files`**: Para archivos originales subidos por usuarios
   - Política: Usuarios autenticados pueden subir/leer sus propios archivos
   - Tamaño máximo: 50MB

2. **`processed-files`**: Para archivos procesados (opcional)
   - Política: Usuarios autenticados pueden leer sus archivos procesados

#### Políticas de Storage
```sql
-- Para original-files
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Configuración de OpenAI

1. Crea una cuenta en [OpenAI](https://platform.openai.com/)
2. Genera una API key
3. Agrega la key a tu archivo `.env.local`

## 🏃‍♂️ Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env.local
# Editar .env.local con tus credenciales
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Construir para producción
```bash
npm run build
npm start
```

## 📁 Estructura de Archivos

### Hooks Personalizados
- `src/lib/hooks/useDashboardStats.ts` - Estadísticas del dashboard
- `src/lib/hooks/useDigitalization.ts` - Procesamiento de archivos

### API Routes
- `src/app/api/process-digitalization/route.ts` - Procesamiento con OpenAI

### Páginas del Dashboard
- `src/app/dashboard/profile/page.tsx` - Perfil del usuario
- `src/app/dashboard/settings/page.tsx` - Configuración

### Componentes Actualizados
- `src/components/dashboard/stats-section.tsx` - Estadísticas reales
- `src/components/dashboard/digitalization-area.tsx` - Procesamiento funcional
- `src/components/dashboard/history-section.tsx` - Historial real

## 🔍 Funcionalidades Clave

### Procesamiento de Archivos
1. **Subida**: Archivo se sube a Supabase Storage
2. **Registro**: Se crea un registro en la tabla `digitalizations`
3. **Procesamiento**: OpenAI Vision API procesa la imagen
4. **Resultado**: Se actualiza el registro con el texto extraído
5. **Notificación**: Usuario recibe confirmación

### Estadísticas en Tiempo Real
- Total de digitalizaciones
- Textos procesados exitosamente
- Dibujos vectorizados
- Tiempo promedio de procesamiento

### Gestión de Usuario
- Edición de perfil con validación
- Configuración de preferencias
- Exportación de datos personales
- Eliminación segura de cuenta

## 🚨 Notas Importantes

1. **Límites de OpenAI**: La API tiene límites de uso y costo
2. **Tamaño de archivos**: Máximo 50MB por archivo
3. **Formatos soportados**: JPG, PNG, WebP, PDF
4. **Autenticación**: Todas las rutas requieren autenticación
5. **Almacenamiento**: Los archivos se almacenan en Supabase Storage

## 🐛 Solución de Problemas

### Error de OpenAI
- Verifica que tu API key sea válida
- Revisa los límites de uso de tu cuenta
- Asegúrate de que la imagen sea accesible públicamente

### Error de Supabase
- Verifica las credenciales de Supabase
- Asegúrate de que las tablas existan
- Revisa las políticas de seguridad

### Error de Storage
- Verifica que los buckets existan
- Revisa las políticas de storage
- Asegúrate de que el usuario esté autenticado

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs del servidor
2. Verifica la configuración de variables de entorno
3. Comprueba la conectividad con Supabase y OpenAI
