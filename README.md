# Vectify - Digitalización con IA 🚀

SaaS para digitalizar manuscritos y dibujos usando inteligencia artificial. Convierte escrituras en texto editable y transforma ilustraciones en vectores.

## ✨ Funcionalidades Principales

- **OCR Inteligente**: Extracción de texto de imágenes usando OpenAI Vision API
- **Vectorización de Dibujos**: Conversión de dibujos a formatos vectoriales
- **Dashboard en Tiempo Real**: Estadísticas y historial de digitalizaciones
- **Gestión de Usuario**: Perfil editable, configuración y exportación de datos
- **Almacenamiento Seguro**: Integración con Supabase Storage
- **Autenticación**: Sistema de autenticación completo con Supabase Auth

## 🎯 Estado del Proyecto

### ✅ Completado
- Dashboard funcional con datos reales
- Procesamiento de archivos con OpenAI
- Sistema de autenticación
- Gestión de perfil y configuración
- Historial de digitalizaciones
- Estadísticas en tiempo real

### 🚧 En Desarrollo
- Vectorización avanzada de dibujos
- Sistema de suscripciones
- Integración con PayPal/Stripe
- Notificaciones por email

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Node.js con API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + Google OAuth
- **Pagos**: PayPal
- **IA**: OpenAI Vision API
- **Deploy**: Vercel/Netlify

## 🚀 Inicio Rápido

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd Vectify
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp env.example .env.local
   # Edita .env.local con tus credenciales
   ```

4. **Configura Supabase**
   - Ejecuta el script `scripts/supabase-setup.sql` en tu proyecto Supabase
   - Crea los buckets de storage necesarios

5. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```

## 📚 Documentación

- **[QUICK_SETUP.md](./QUICK_SETUP.md)** - Configuración rápida para solucionar errores
- **[SETUP.md](./SETUP.md)** - Instrucciones detalladas de configuración
- **[HUGGINGFACE_SETUP.md](./HUGGINGFACE_SETUP.md)** - Configuración de IA gratuita (30,000 requests/mes)

## 📦 Instalación Detallada

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/vectify.git
cd vectify
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Ejecuta en desarrollo**
```bash
npm run dev
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno** en el dashboard de Vercel
3. **Deploy automático** en cada push

### Netlify

1. **Conecta tu repositorio a Netlify**
2. **Configuración de build**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Configura las variables de entorno** en el dashboard

### Otras plataformas

El proyecto incluye configuraciones para:
- `vercel.json` - Configuración para Vercel
- `netlify.toml` - Configuración para Netlify
- `next.config.js` - Configuración optimizada para producción

## 🔧 Configuración

### Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Habilita Google OAuth en Authentication > Providers
3. Configura las variables de entorno

### PayPal

1. Crea una cuenta en [PayPal Developer](https://developer.paypal.com)
2. Configura las credenciales de OAuth
3. Configura el webhook en `/api/webhooks/paypal`

### OpenAI

1. Obtén tu API key en [OpenAI](https://platform.openai.com)
2. Configura la variable `OPENAI_API_KEY`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── dashboard/        # Componentes del dashboard
│   └── payment/          # Componentes de pago
├── lib/                  # Utilidades y configuraciones
└── types/                # Tipos TypeScript
```

## 🎯 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

## 🔒 Seguridad

- Encriptación SSL/TLS
- Autenticación OAuth segura
- Validación de inputs
- Headers de seguridad configurados
- Cumplimiento GDPR

## 📱 Responsive

- Diseño mobile-first
- Componentes adaptativos
- Navegación optimizada para móvil
- Captura de cámara integrada

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas con el deploy:

1. **Verifica las variables de entorno** están configuradas correctamente
2. **Revisa los logs de build** en tu plataforma de deploy
3. **Asegúrate de que Node.js 18+** esté configurado
4. **Verifica que el repositorio** esté conectado correctamente

## 🌟 Características Destacadas

- **Interfaz moderna** con dark/light mode
- **Navegación fluida** entre páginas
- **Componentes reutilizables** y bien estructurados
- **Optimización de rendimiento** con Next.js 14
- **SEO optimizado** con metadatos dinámicos
- **Accesibilidad** siguiendo estándares WCAG
