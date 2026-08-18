import React from 'react';
import { Locale } from '@/lib/i18n/config';
import { WishlistClient } from './WishlistClient';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { ProductData } from '@/lib/data/products';
import { Metadata } from 'next';

interface WishlistPageProps {
  params: { lang: Locale };
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'المنتجات المفضلة | مختبرات الفياصل الدوائية' : 'Favorite Products | Al Fayasel Laboratories',
    description: isAr
      ? 'قائمة المنتجات المفضلة الخاصة بك من مختبرات الفياصل الدوائية.'
      : 'Your personal list of favorite products from Al Fayasel Laboratories.',
  };
}

export const revalidate = 3600; // ISR for performance

export default async function WishlistPage({ params: { lang } }: WishlistPageProps) {
  let products: ProductData[] = [];

  try {
    await dbConnect();
    const productsRaw = await Product.find({ isPaused: false }).sort({ createdAt: -1 }).lean();
    products = productsRaw.map((p: any) => ({
      id: p._id.toString(),
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      description: p.description,
      usage: p.usage,
      price: p.price,
      originalPrice: p.originalPrice,
      categorySlug: p.categorySlug,
      categoryName: p.categoryName,
      images: p.images,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      isNewArrival: p.isNewArrival,
      isFeatured: p.isFeatured,
      isTopSeller: p.isTopSeller,
      rating: p.rating || 5.0,
      reviewCount: p.reviewCount || 12,
      variations: (p.variations || []).map((v: any) => ({
        sku: v.sku,
        price: v.price,
        originalPrice: v.originalPrice,
        images: v.images || [],
        attributes: v.attributes ? { ...v.attributes } : {},
        inStock: v.inStock !== false,
        stockQuantity: v.stockQuantity || 0,
      })),
    }));
  } catch (err) {
    console.error('Failed to get products for wishlist page:', err);
    products = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WishlistClient lang={lang} allProducts={products} />
    </div>
  );
}
