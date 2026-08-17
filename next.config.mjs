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

  async headers() {
    return [
      // Static images: cache for 1 year immutably
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Next.js static chunks: cache forever
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // API routes: allow short-term caching (10 seconds, stale-while-revalidate 60s)
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=10, stale-while-revalidate=60' },
        ],
      },
    ];
  },
};

export default nextConfig;
