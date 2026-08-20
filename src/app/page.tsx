import { Metadata } from 'next';
import { HomePageClient } from '@/components/home/HomePageClient';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { StickyHeader } from '@/components/layout/StickyHeader';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Al Fayasel Laboratories | Premium Medical & Cosmetic Products',
  description: 'Browse high-quality medical cosmetics, skin care, hair care, and sanitizers developed by Al Fayasel Laboratories.',
  alternates: {
    canonical: 'https://alfayasel.com',
    languages: {
      en: 'https://alfayasel.com/en',
      ar: 'https://alfayasel.com/ar',
    },
  },
  openGraph: {
    title: 'Al Fayasel Laboratories | Premium Medical & Cosmetic Products',
    description: 'Browse high-quality medical cosmetics, skin care, hair care, and sanitizers developed by Al Fayasel Laboratories.',
    url: 'https://alfayasel.com',
    siteName: 'Al Fayasel Laboratories',
    images: [
      {
        url: 'https://alfayasel.com/api/og-image?img=/images/alfayasel-logo-new-02.png',
        width: 800,
        height: 800,
        alt: 'Al Fayasel Laboratories',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Fayasel Laboratories | Premium Medical & Cosmetic Products',
    description: 'Browse high-quality medical cosmetics, skin care, hair care, and sanitizers developed by Al Fayasel Laboratories.',
    images: ['https://alfayasel.com/api/og-image?img=/images/alfayasel-logo-new-02.png'],
  },
};

// Fetch all 3 tabs server-side in parallel
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
  } catch (err) {
    console.error('Failed to fetch tab products for root page:', err);
    return { new: [], featured: [], topSeller: [] };
  }
}

// RootHomePage fetches tab products on the server side to ensure English homepage has products
export default async function RootHomePage() {
  const initialTabData = await getTabProducts();

  return (
    <div dir="ltr" className="font-sans">
      <OrganizationJsonLd />
      <Suspense fallback={null}>
        <StickyHeader locale="en" />
      </Suspense>
      <TopBar locale="en" />
      <Suspense fallback={null}>
        <Header locale="en" />
      </Suspense>
      <Suspense fallback={null}>
        <Navbar locale="en" />
      </Suspense>

      <main className="min-h-screen">
        <Suspense fallback={<div className="h-[600px] bg-gray-50 animate-pulse" />}>
          <HomePageClient lang="en" initialTabData={initialTabData} />
        </Suspense>
      </main>

      <Footer locale="en" />
      <CartDrawer locale="en" />
    </div>
  );
}
