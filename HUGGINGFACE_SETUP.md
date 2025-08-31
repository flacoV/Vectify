# 🤗 Configuración de Hugging Face (30,000 requests gratis/mes)

## ¿Qué es Hugging Face?

Hugging Face es una plataforma líder en IA que ofrece **30,000 requests gratuitos por mes** en su API de inferencia. Es mucho más generosa que otras alternativas y ofrece miles de modelos de IA especializados.

## 🚀 Ventajas de Hugging Face

- ✅ **30,000 requests gratis/mes** (vs 500 de Replicate)
- ✅ **Muy barato después** ($0.0001 por segundo
- ✅ **Miles de modelos** especializados disponibles
- ✅ **Fácil de integrar** con API REST
- ✅ **No requiere tarjeta de crédito** para empezar
- ✅ **Modelos de alta calidad** como Stable Diffusion

## 📋 Pasos para configurar

### 1. Crear cuenta en Hugging Face

1. Ve a [huggingface.co](https://huggingface.co)
2. Haz clic en "Sign up"
3. Crea una cuenta gratuita
4. **No necesitas tarjeta de crédito** para empezar

### 2. Obtener API Token

1. Ve a tu [perfil](https://huggingface.co/settings/tokens)
2. Haz clic en "New token"
3. Dale un nombre (ej: "Vectify")
4. Selecciona "Read" permissions
5. Copia el token generado

### 3. Configurar en tu proyecto

1. Abre tu archivo `.env.local`
2. Agrega la variable:
   ```bash
   HUGGINGFACE_API_TOKEN=tu_token_aqui
   ```
3. Reinicia tu servidor de desarrollo

## 🔧 Cómo funciona en Vectify

El sistema ahora intenta procesar imágenes en este orden:

1. **Hugging Face (30,000 gratis/mes)** - Primera opción
   - Intenta generar nueva imagen con Stable Diffusion
   - Si falla, mejora la imagen original con Real-ESRGAN
2. **DALL-E** - Si Hugging Face falla
3. **Fallback** - Imágenes placeholder si ambos fallan

## 📊 Modelos utilizados

### Stable Diffusion (Generación)
- **Modelo**: `runwayml/stable-diffusion-v1-5`
- **Uso**: Transformar dibujos en ilustraciones digitales
- **Costo**: Gratis hasta 30,000 requests/mes

### Real-ESRGAN (Mejora)
- **Modelo**: `caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr`
- **Uso**: Mejorar calidad de imágenes existentes
- **Costo**: Gratis hasta 30,000 requests/mes

### Otros modelos disponibles
- **GFPGAN**: Mejora de rostros
- **ControlNet**: Control preciso de generación
- **BLIP**: Descripción de imágenes
- **CLIP**: Clasificación de imágenes

## 🧪 Probar la configuración

1. **Configura el token** en `.env.local`
2. **Reinicia el servidor**
3. **Sube una imagen** y procésala como dibujo
4. **Revisa la consola** para ver los logs de Hugging Face

## 📝 Logs esperados

```
API: Procesando dibujo...
API: Intentando con Hugging Face (30,000 requests gratis/mes)...
API: Procesando con Hugging Face...
API: Imagen procesada con Hugging Face (base64)
API: URLs generadas con Hugging Face: {
  vectorUrl: 'data:image/... (base64)',
  pngUrl: 'data:image/... (base64)',
  note: 'Imagen procesada con Hugging Face (30,000 requests gratis/mes)'
}
```

## 💡 Consejos

- **Monitorea tu uso** en el dashboard de Hugging Face
- **Los primeros requests** pueden tardar más tiempo (cold start)
- **Si falla la generación**, automáticamente intenta mejorar la imagen
- **El fallback** siempre está disponible como respaldo
- **Las imágenes se devuelven en base64** para evitar problemas de CORS

## 🔗 Enlaces útiles

- [Hugging Face Dashboard](https://huggingface.co/settings/tokens)
- [API Documentation](https://huggingface.co/docs/api-inference)
- [Modelos disponibles](https://huggingface.co/models)
- [Precios](https://huggingface.co/pricing)
- [Stable Diffusion](https://huggingface.co/runwayml/stable-diffusion-v1-5)
- [Real-ESRGAN](https://huggingface.co/caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr)
