/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', 
      'supabase.co',
      'rvswgfunrkbzparfmxac.supabase.co',
      'api-inference.huggingface.co',
      'oaidalleapiprodscus.blob.core.windows.net'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
