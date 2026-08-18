import React from 'react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { ProductData } from '@/lib/data/products';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ShopClient } from './ShopClient';
import { Metadata } from 'next';

interface ShopPageProps {
  params: { lang: Locale };
  searchParams: { q?: string };
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  const canonicalUrl = params.lang === 'en' 
    ? 'https://alfayasel.com/shop' 
    : `https://alfayasel.com/ar/shop`;

  return {
    title: isAr ? 'تسوق الآن | مختبرات الفياصل' : 'Shop | Al Fayasel Laboratories',
    description: isAr
      ? 'تصفح جميع منتجات مختبرات الفياصل الدوائية من عناية بالبشرة والشعر والمعقمات.'
      : 'Browse all Al Fayasel Laboratories products including skincare, haircare, and sanitizers.',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://alfayasel.com/shop',
        ar: 'https://alfayasel.com/ar/shop',
      },
    },
  };
}

export const revalidate = 3600;

async function getProducts(q?: string) {
  try {
    await dbConnect();
    const query: any = { isPaused: false };
    
    if (q) {
      query.$or = [
        { 'name.en': { $regex: q, $options: 'i' } },
        { 'name.ar': { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
      ];
    }
    
    const raw = await Product.find(query).sort({ createdAt: -1 }).lean();
    return raw.map((p: any): ProductData => ({
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
  } catch {
    return [];
  }
}

export default async function ShopPage({ params: { lang }, searchParams }: ShopPageProps) {
  const isAr = lang === 'ar';
  const dict = getDictionary(lang);
  
  const products = await getProducts(searchParams.q);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `https://alfayasel.com/${lang}` },
          { name: isAr ? 'المتجر' : 'Shop', url: `https://alfayasel.com/${lang}/shop` },
        ]}
      />

      {/* Page Header */}
      <div className="bg-white p-5 md:p-6 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            {dict.hero.exploreCatalog}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {dict.filter.showing}{' '}
            <span className="font-bold text-brand-600">{products.length}</span>{' '}
            {dict.filter.results}
          </p>
        </div>
      </div>

      {/* Client filtering/sorting layer */}
      <ShopClient
        lang={lang}
        initialProducts={products}
        initialCategory=""
        initialQuery={searchParams.q || ''}
      />
    </div>
  );
}
