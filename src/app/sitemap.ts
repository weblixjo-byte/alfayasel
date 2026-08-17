import { MetadataRoute } from 'next';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alfayasel.com';
  const locales = ['en', 'ar'];

  const routes = ['', '/shop', '/about', '/contact'].flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  let dbProducts: any[] = [];
  try {
    await dbConnect();
    dbProducts = await Product.find({ isPaused: false });
  } catch (error) {
    console.error('Failed to load products for sitemap:', error);
  }

  const productRoutes = dbProducts.flatMap((product) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  );

  return [...routes, ...productRoutes];
}
