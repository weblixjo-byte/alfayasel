/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress all responses with gzip
  compress: true,

  // Disable Next.js server-side image optimization.
  // Since all images are already highly optimized WebP files, serving them directly
  // from Netlify's static CDN is MUCH faster than routing them through serverless functions.
  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
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
      // Removed faulty terms-and-conditions redirect
      // Removed faulty ar/terms-and-conditions redirect
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
      
      
    ];
  },
};

export default nextConfig;
