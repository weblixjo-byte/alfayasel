/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress all responses with gzip
  compress: true,

  // Aggressive image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year for optimized images
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  async redirects() {
    return [
      // Language root redirect
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      // Static aliases
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/ar/about', destination: '/ar/about-us', permanent: true },
      { source: '/contact', destination: '/contact-us', permanent: true },
      { source: '/ar/contact', destination: '/ar/contact-us', permanent: true },
      { source: '/privacy-policy', destination: '/privacy-policy-3', permanent: true },
      { source: '/ar/privacy-policy', destination: '/ar/privacy-policy-3', permanent: true },
      { source: '/returns', destination: '/return-policy', permanent: true },
      { source: '/ar/returns', destination: '/ar/return-policy', permanent: true },
      { source: '/cancellation', destination: '/cancellation-policy', permanent: true },
      { source: '/ar/cancellation', destination: '/ar/cancellation-policy', permanent: true },
      { source: '/terms-and-conditions', destination: '/trems-and-conditions', permanent: true },
      { source: '/ar/terms-and-conditions', destination: '/ar/trems-and-conditions', permanent: true },
    ];
  },

  async headers() {
    return [
      // Static assets & images: cache for 1 year immutably at CDN Edge
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
        ],
      },
      // Next.js static JS/CSS chunks: cache forever
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, s-maxage=31536000, immutable' },
        ],
      },
      // HTML Pages: Cache on CDN with ISR stale-while-revalidate
      {
        source: '/((?!admin|api).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400' },
        ],
      },
      // API routes: allow short-term caching
      {
        source: '/api/products',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      {
        source: '/api/categories',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=1200' },
        ],
      },
    ];
  },
};

export default nextConfig;
