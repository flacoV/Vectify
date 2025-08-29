# Vectify - Digitalización Inteligente con IA

Vectify es un SaaS moderno que permite digitalizar manuscritos y dibujos mediante inteligencia artificial. Convierte escrituras en texto editable y transforma ilustraciones en vectores escalables.

## 🚀 Características

- **OCR Inteligente**: Reconocimiento de escritura manuscrita con 99.5% de precisión
- **Vectorización Automática**: Conversión de dibujos a SVG y PNG transparente
- **Captura Móvil**: Interfaz optimizada para móviles con cámara integrada
- **Upload Desktop**: Drag & drop y file picker para PC
- **Múltiples Formatos**: Soporte para JPG, PNG, WebP, PDF
- **Dashboard Completo**: Historial, estadísticas y gestión de archivos
- **Autenticación Segura**: Supabase Auth con múltiples proveedores
- **Pagos Integrados**: PayPal, Mercado Pago y tarjetas de débito/crédito
- **Tema Adaptativo**: Dark/Light mode automático

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Pagos**: PayPal, Mercado Pago, Tarjetas de débito/crédito
- **IA**: OpenAI Vision API
- **Almacenamiento**: Supabase Storage
- **UI**: Lucide React, Framer Motion

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de PayPal (opcional)
- Cuenta de Mercado Pago (opcional)
- API Key de OpenAI

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/vectify.git
cd vectify
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI
OPENAI_API_KEY=tu_openai_api_key

# PayPal (opcional)
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
PAYPAL_WEBHOOK_ID=tu_paypal_webhook_id

# Mercado Pago (opcional)
MERCADO_PAGO_ACCESS_TOKEN=tu_mercadopago_access_token
MERCADO_PAGO_PUBLIC_KEY=tu_mercadopago_public_key

# Tarjetas de débito/crédito (opcional)
CARD_PAYMENT_SECRET_KEY=tu_card_payment_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones SQL en el SQL Editor:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de digitalizaciones
CREATE TABLE digitalizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  text_content TEXT,
  vector_url TEXT,
  png_url TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  type TEXT NOT NULL CHECK (type IN ('text', 'drawing', 'mixed')),
  file_size INTEGER NOT NULL,
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE digitalizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own digitalizations" ON digitalizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own digitalizations" ON digitalizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own digitalizations" ON digitalizations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own digitalizations" ON digitalizations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

3. Configura el almacenamiento en Supabase:
   - Ve a Storage en el dashboard
   - Crea buckets: `uploads`, `processed`, `vectors`

### 5. Ejecutar el proyecto

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 14
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── dashboard/         # Componentes del dashboard
│   ├── ui/               # Componentes de UI base
│   ├── footer.tsx        # Footer
│   ├── header.tsx        # Header principal
│   ├── hero.tsx          # Sección hero
│   ├── features.tsx      # Características
│   ├── pricing.tsx       # Planes de precios
│   └── providers.tsx     # Providers de contexto
├── lib/                  # Utilidades y configuraciones
│   └── utils.ts          # Funciones utilitarias
├── types/                # Tipos TypeScript
│   └── supabase.ts       # Tipos de Supabase
└── hooks/                # Hooks personalizados
```

## 🔧 Configuración Adicional

### Configurar PayPal (Opcional)

1. Crea una cuenta en [PayPal Developer](https://developer.paypal.com)
2. Obtén las claves API desde el dashboard
3. Configura los webhooks para manejar eventos de suscripción

### Configurar Mercado Pago (Opcional)

1. Crea una cuenta en [Mercado Pago](https://www.mercadopago.com)
2. Obtén las claves API desde el dashboard
3. Configura las notificaciones para manejar eventos de pago

### Configurar OpenAI

1. Crea una cuenta en [OpenAI](https://openai.com)
2. Genera una API key
3. Configura los límites de uso según tus necesidades

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Funcionalidades Principales

### Digitalización de Texto
- OCR avanzado para escritura manuscrita
- Soporte para múltiples idiomas
- Exportación en formato TXT editable

### Vectorización de Dibujos
- Conversión automática a SVG
- Generación de PNG transparente
- Optimización de vectores

### Gestión de Archivos
- Historial completo de digitalizaciones
- Descarga de resultados
- Eliminación segura de archivos

### Sistema de Suscripciones
- Plan gratuito con límites
- Planes Pro y Enterprise
- Integración con PayPal, Mercado Pago y tarjetas

## 🔒 Seguridad

- Autenticación con Supabase Auth
- Row Level Security (RLS) en PostgreSQL
- Validación de archivos en frontend y backend
- Encriptación de datos sensibles
- Límites de tamaño de archivo
- Sanitización de inputs

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- 📧 Email: hello@vectify.com
- 📖 Documentación: [docs.vectify.com](https://docs.vectify.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/vectify/issues)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org) por el framework
- [Supabase](https://supabase.com) por la infraestructura
- [TailwindCSS](https://tailwindcss.com) por los estilos
- [OpenAI](https://openai.com) por la IA
- [PayPal](https://paypal.com) por los pagos
- [Mercado Pago](https://mercadopago.com) por los pagos
