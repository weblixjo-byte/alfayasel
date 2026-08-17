import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ProductCard } from '@/components/store/ProductCard';
import ProductShowcaseClient from './ProductShowcaseClient';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export const revalidate = 3600; // 1 Hour ISR - Cached on CDN Edge with 0 Serverless Function cost

export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({ isPaused: false }, { slug: 1 }).lean();
    const locales: Locale[] = ['en', 'ar'];
    return products.flatMap((p: any) =>
      locales.map((lang) => ({
        lang,
        slug: p.slug,
      }))
    );
  } catch (error) {
    console.error('Failed to generate static params for products:', error);
    return [];
  }
}

interface ProductPageProps {
  params: { lang: Locale; slug: string };
  searchParams?: { sku?: string };
}

async function getDbProduct(slug: string): Promise<ProductData | null> {
  try {
    await dbConnect();
    const p = await Product.findOne({ slug, isPaused: false }).lean();
    if (!p) return null;
    return {
      id: (p as any)._id.toString(),
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
      variations: p.variations
        ? p.variations.map((v: any) => ({
            sku: v.sku,
            price: v.price,
            originalPrice: v.originalPrice,
            images: v.images || [],
            attributes: v.attributes ? { ...v.attributes } : {},
            inStock: v.inStock !== false,
            stockQuantity: v.stockQuantity || 0,
            name: v.name || { en: '', ar: '' },
            description: v.description || { en: '', ar: '' },
          }))
        : [],
    };
  } catch (err) {
    console.error('Failed to get product from DB:', err);
    return null;
  }
}

async function getRelatedDbProducts(categorySlug: string, currentSlug: string): Promise<ProductData[]> {
  try {
    await dbConnect();
    const products = await Product.find({
      categorySlug,
      isPaused: false,
      slug: { $ne: currentSlug }
    }).limit(4).lean();

    return products.map(p => ({
      id: (p as any)._id.toString(),
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
    }));
  } catch (err) {
    console.error('Failed to get related products from DB:', err);
    return [];
  }
}

// Clean HTML tags and truncate for Meta Description
function cleanDescription(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const product = await getDbProduct(params.slug);
  if (!product) return {};

  // Check if a specific variation is requested in the URL parameter
  const selectedVariation = searchParams?.sku
    ? product.variations?.find((v) => v.sku === searchParams.sku)
    : null;

  // Customize SEO Title based on size/name variation
  const variationName = selectedVariation?.name?.[params.lang];
  const titleText = variationName
    ? `${product.name[params.lang]} (${variationName}) | Al Fayasel Laboratories`
    : `${product.name[params.lang]} | Al Fayasel Laboratories`;

  // Customize SEO Description based on variation specific description
  const variationDesc = selectedVariation?.description?.[params.lang];
  const rawDescription = variationDesc || product.description[params.lang] || product.usage[params.lang];
  const description = cleanDescription(rawDescription);

  const canonicalUrl = searchParams?.sku
    ? `https://alfayasel.com/${params.lang}/product/${product.slug}?sku=${searchParams.sku}`
    : `https://alfayasel.com/${params.lang}/product/${product.slug}`;

  const imageUrl = selectedVariation?.images?.[0] || product.images?.[0]
    ? ((selectedVariation?.images?.[0] || product.images[0]).startsWith('http')
        ? (selectedVariation?.images?.[0] || product.images[0])
        : `https://alfayasel.com${selectedVariation?.images?.[0] || product.images[0]}`)
    : 'https://alfayasel.com/images/placeholder.jpg';

  return {
    title: titleText,
    description: description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://alfayasel.com/en/product/${product.slug}`,
        ar: `https://alfayasel.com/ar/product/${product.slug}`,
      },
    },
    openGraph: {
      title: titleText,
      description: description,
      url: canonicalUrl,
      siteName: 'Al Fayasel Laboratories',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name[params.lang],
        },
      ],
      locale: params.lang === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params: { lang, slug }, searchParams }: ProductPageProps) {
  const dict = getDictionary(lang);
  const product = await getDbProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedDbProducts(product.categorySlug, slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <ProductJsonLd product={product} locale={lang} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `https://alfayasel.com/${lang}` },
          { name: 'Shop', url: `https://alfayasel.com/${lang}/shop` },
          { name: product.name[lang], url: `https://alfayasel.com/${lang}/product/${product.slug}` },
        ]}
      />

      {/* Main Product Showcase - passing selected variation SKU as initial parameter */}
      <ProductShowcaseClient 
        product={product} 
        locale={lang} 
        initialVariationSku={searchParams?.sku}
      />

      {/* Tabs Section (Description / Usage / Reviews) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
          {dict.product.usage}
        </h3>
        <div 
          className="prose prose-sm text-gray-700 leading-relaxed max-w-none text-xs md:text-sm font-normal"
          dangerouslySetInnerHTML={{ __html: product.usage[lang] }}
        />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {dict.product.relatedProducts}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} locale={lang} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
