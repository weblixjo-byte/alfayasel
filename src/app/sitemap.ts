import { MetadataRoute } from 'next';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alfayasel.com';
  const locales = ['en', 'ar'];

  // Static routes using the correct canonical URLs (no redirects)
  const routes = ['', '/shop', '/about-us', '/contact-us', '/our-certificates'].flatMap((route) =>
    locales.map((locale) => {
      // English has no prefix, Arabic has '/ar' prefix
      const path = locale === 'en' ? route : `/ar${route}`;
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
      };
    })
  );

  let dbProducts: any[] = [];
  try {
    await dbConnect();
    dbProducts = await Product.find({ isPaused: false }).lean();
  } catch (error) {
    console.error('Failed to load products for sitemap:', error);
  }

  // Dynamic product routes with correct locale prefixing
  const productRoutes = dbProducts.flatMap((product) =>
    locales.map((locale) => {
      // English has no prefix, Arabic has '/ar' prefix
      const path = locale === 'en' ? `/product/${product.slug}` : `/ar/product/${product.slug}`;
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    })
  );

  return [...routes, ...productRoutes];
}
