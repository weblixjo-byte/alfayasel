import React from 'react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductCard } from '@/components/store/ProductCard';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { ProductData } from '@/lib/data/products';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

interface OurProductsPageProps {
  params: { lang: Locale };
}

// Revalidate every 60s — fast ISR, no force-dynamic overhead
export const revalidate = 60;

export async function generateMetadata({ params }: OurProductsPageProps) {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'منتجاتنا | مختبرات الفياصل الدوائية' : 'Our Products | Al Fayasel Laboratories',
    description: isAr ? 'تصفح جميع المنتجات الطبية ومستحضرات التجميل المتميزة من مختبرات الفياصل الدوائية.' : 'Browse all medical and premium cosmetic products by Al Fayasel Laboratories.',
  };
}

export default async function OurProductsPage({ params: { lang } }: OurProductsPageProps) {
  const isAr = lang === 'ar';
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
  } catch {
    // DB unreachable — render empty state gracefully
    products = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `https://alfayasel.com/${lang}` },
          { name: isAr ? 'منتجاتنا' : 'Our Products', url: `https://alfayasel.com/${lang}/our-products` },
        ]}
      />

      {/* Page Title Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xs flex flex-col gap-2 text-center md:text-left rtl:text-right">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {isAr ? 'منتجاتنا' : 'Our Products'}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl font-normal">
          {isAr 
            ? 'تصفح تشكيلة منتجاتنا الطبية، ومستحضرات التجميل، والمعقمات، ومستلزمات الرعاية الشخصية المتكاملة.'
            : 'Browse our complete catalog of medical, cosmetic, sanitizers, and personal care products.'}
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3 shadow-xs">
          <p className="text-gray-500 font-medium">
            {isAr ? 'لا توجد منتجات متوفرة حالياً.' : 'No products available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
