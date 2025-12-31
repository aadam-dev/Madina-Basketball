/**
 * Next.js Configuration
 * 
 * Configures:
 * - Security headers (HSTS, XSS protection, etc.)
 * - Image optimization settings
 * - Performance optimizations
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Performance optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  
  /**
   * Security headers
   * Applied to all routes to enhance security
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
  /**
   * Image optimization configuration
   * 
   * Next.js automatically optimizes images by:
   * - Converting to modern formats (AVIF, WebP)
   * - Generating responsive sizes
   * - Lazy loading below-the-fold images
   * - Caching optimized images
   */
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon and thumbnail sizes
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow images from Supabase Storage
      },
    ],
  },
  
  /**
   * Experimental features
   * Enable performance optimizations
   */
  experimental: {
    optimizeCss: true, // Optimize CSS output
  },
}

module.exports = nextConfig

