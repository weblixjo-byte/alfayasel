import React from 'react';
import { Locale } from '@/lib/i18n/config';
import { HomePageClient } from '@/components/home/HomePageClient';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { Metadata } from 'next';

interface PageProps {
  params: { lang: Locale };
}

export async function generateMetadata({ params: { lang } }: PageProps): Promise<Metadata> {
  const isAr = lang === 'ar';
  const title = isAr ? 'مختبرات الفياصل الدوائية | مستحضرات طبية وتجميلية متميزة' : 'Al Fayasel Laboratories | Premium Medical & Cosmetic Products';
  const description = isAr 
    ? 'تصفح منتجات مختبرات الفياصل الدوائية الرائدة في مجال المعقمات، العناية بالبشرة والشعر، ومستحضرات التجميل الطبية عالية الجودة.'
    : 'Browse high-quality medical cosmetics, skin care, hair care, and sanitizers developed by Al Fayasel Laboratories.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://alfayasel.com/${lang}`,
      languages: {
        en: 'https://alfayasel.com/en',
        ar: 'https://alfayasel.com/ar',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://alfayasel.com/${lang}`,
      siteName: 'Al Fayasel Laboratories',
      images: [
        {
          url: 'https://alfayasel.com/images/alfayasel-logo-new-02.png',
          width: 800,
          height: 800,
          alt: 'Al Fayasel Laboratories',
        },
      ],
      locale: isAr ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://alfayasel.com/images/alfayasel-logo-new-02.png'],
    },
  };
}

// Fetch all 3 tabs server-side in parallel — no client-side fetch needed
async function getTabProducts() {
  try {
    await dbConnect();
    const [newProducts, featuredProducts, topSellerProducts] = await Promise.all([
      Product.find({ isPaused: false, isNewArrival: true }).sort({ createdAt: -1 }).lean(),
      Product.find({ isPaused: false, isFeatured: true }).sort({ createdAt: -1 }).lean(),
      Product.find({ isPaused: false, isTopSeller: true }).sort({ createdAt: -1 }).lean(),
    ]);

    const serialize = (arr: any[]) =>
      arr.map((p) => ({ ...p, _id: p._id.toString(), id: p._id.toString() }));

    return {
      new: serialize(newProducts),
      featured: serialize(featuredProducts),
      topSeller: serialize(topSellerProducts),
    };
  } catch {
    return { new: [], featured: [], topSeller: [] };
  }
}

export default async function Page({ params: { lang } }: PageProps) {
  const initialTabData = await getTabProducts();
  return <HomePageClient lang={lang} initialTabData={initialTabData} />;
}
