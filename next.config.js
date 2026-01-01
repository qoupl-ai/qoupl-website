/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set Turbopack root directory to silence workspace root warning
  // This is needed when multiple lockfiles exist in parent directories
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Configure image qualities (add 85 to support current usage)
    qualities: [75, 85],
    // Optimize device sizes (reduce variants for faster builds)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },
}

module.exports = nextConfig
