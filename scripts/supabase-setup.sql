-- Script de configuración para Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Crear tabla de usuarios (si no existe)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
    subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de digitalizaciones
CREATE TABLE IF NOT EXISTS public.digitalizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    original_filename TEXT NOT NULL,
    original_url TEXT NOT NULL,
    processed_url TEXT,
    text_content TEXT,
    vector_url TEXT,
    png_url TEXT,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    type TEXT NOT NULL CHECK (type IN ('text', 'drawing', 'mixed')),
    file_size BIGINT NOT NULL,
    processing_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_digitalizations_user_id ON public.digitalizations(user_id);
CREATE INDEX IF NOT EXISTS idx_digitalizations_created_at ON public.digitalizations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_digitalizations_status ON public.digitalizations(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digitalizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Políticas para la tabla users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Políticas para la tabla digitalizations
CREATE POLICY "Users can view own digitalizations" ON public.digitalizations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own digitalizations" ON public.digitalizations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own digitalizations" ON public.digitalizations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own digitalizations" ON public.digitalizations
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Políticas para la tabla subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digitalizations_updated_at BEFORE UPDATE ON public.digitalizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Función para crear perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Crear buckets de storage (ejecutar manualmente en el dashboard)
-- original-files
-- processed-files

-- 14. Políticas para storage (ejecutar después de crear los buckets)
-- Para original-files:
-- CREATE POLICY "Users can upload their own files" ON storage.objects
--     FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own files" ON storage.objects
--     FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own files" ON storage.objects
--     FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Para processed-files:
-- CREATE POLICY "Users can view their processed files" ON storage.objects
--     FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Comentarios adicionales:
-- 1. Ejecuta este script en el SQL Editor de Supabase
-- 2. Crea los buckets de storage manualmente en el dashboard
-- 3. Aplica las políticas de storage después de crear los buckets
-- 4. Verifica que todas las políticas estén funcionando correctamente
