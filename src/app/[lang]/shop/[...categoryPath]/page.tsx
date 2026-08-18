import React from 'react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { ProductData, INITIAL_CATEGORIES } from '@/lib/data/products';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ShopClient } from '../ShopClient';
import { Metadata } from 'next';

interface ShopPageProps {
  params: { lang: Locale; categoryPath: string[] };
  searchParams: { q?: string };
}

export async function generateStaticParams() {
  const paths: any[] = [];
  const langs = ['en', 'ar'];
  
  for (const lang of langs) {
    for (const cat of INITIAL_CATEGORIES) {
      // Parent category paths
      paths.push({ lang, categoryPath: [cat.slug] });
      
      for (const sub of cat.subcategories) {
        // Subcategory paths
        paths.push({ lang, categoryPath: [cat.slug, sub.slug] });
      }
    }
  }
  return paths;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  const categoryPath = params.categoryPath || [];
  
  let pageTitle = isAr ? 'تسوق الآن | مختبرات الفياصل' : 'Shop | Al Fayasel Laboratories';
  let pageDesc = isAr
    ? 'تصفح جميع منتجات مختبرات الفياصل الدوائية من عناية بالبشرة والشعر والمعقمات.'
    : 'Browse all Al Fayasel Laboratories products including skincare, haircare, and sanitizers.';

  if (categoryPath.length > 0) {
    const activeSlug = categoryPath[categoryPath.length - 1];
    
    // Find category details
    const cat = INITIAL_CATEGORIES.find(c => c.slug === activeSlug);
    const sub = INITIAL_CATEGORIES.flatMap(c => c.subcategories).find(s => s.slug === activeSlug);
    
    if (cat) {
      pageTitle = isAr ? `${cat.name.ar} | مختبرات الفياصل` : `${cat.name.en} | Al Fayasel Laboratories`;
    } else if (sub) {
      pageTitle = isAr ? `${sub.name.ar} | مختبرات الفياصل` : `${sub.name.en} | Al Fayasel Laboratories`;
    }
  }

  const pathStr = categoryPath.join('/');
  const canonicalUrl = params.lang === 'en'
    ? `https://alfayasel.com/shop/${pathStr}`
    : `https://alfayasel.com/ar/shop/${pathStr}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://alfayasel.com/shop/${pathStr}`,
        ar: `https://alfayasel.com/ar/shop/${pathStr}`,
      },
    },
  };
}

export const revalidate = 60;

async function getProducts(category?: string, q?: string) {
  try {
    await dbConnect();
    const query: any = { isPaused: false };
    
    if (category) {
      const cat = INITIAL_CATEGORIES.find(c => c.slug === category);
      if (cat) {
        const subSlugs = cat.subcategories.map(sub => sub.slug);
        query.categorySlug = { $in: [category, ...subSlugs] };
      } else {
        query.categorySlug = category;
      }
    }
    
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

export default async function ShopPage({ params: { lang, categoryPath }, searchParams }: ShopPageProps) {
  const isAr = lang === 'ar';
  const dict = getDictionary(lang);
  
  const pathArr = categoryPath || [];
  const selectedCat = pathArr.length > 0 ? pathArr[pathArr.length - 1] : undefined;
  
  const products = await getProducts(selectedCat, searchParams.q);

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
        initialCategory={selectedCat || ''}
        initialQuery={searchParams.q || ''}
      />
    </div>
  );
}
