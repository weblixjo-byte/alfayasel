'use client';

import React, { useState, Suspense } from 'react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { ProductCard } from '@/components/store/ProductCard';
import { QuickViewModal } from '@/components/store/QuickViewModal';
import { HeroSection } from '@/components/home/HeroSection';

type TabKey = 'new' | 'featured' | 'topSeller';

interface HomePageClientProps {
  lang: Locale;
  initialTabData?: Record<TabKey, ProductData[]>;
}

export const HomePageClient: React.FC<HomePageClientProps> = ({ lang, initialTabData }) => {
  const dict = getDictionary(lang);
  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);

  // Safe fallback if server fetch failed (e.g. DB connection issue)
  const safeData: Record<TabKey, ProductData[]> = initialTabData ?? { new: [], featured: [], topSeller: [] };
  const currentProducts = safeData[activeTab] ?? [];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section */}
      <Suspense fallback={<div className="h-[470px] bg-gray-100 animate-pulse" />}>
        <HeroSection locale={lang} />
      </Suspense>

      {/* 2. Free Delivery Banner */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white py-6 text-center space-y-1.5">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {lang === 'ar'
              ? 'أي طلبية تقل عن ١٠ دنانير عليها دينارين توصيل'
              : 'Any order under 10 JOD is subject to a 2 JOD delivery fee.'}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {lang === 'ar'
              ? 'احصل على توصيل مجاني عند التسوق بقيمة 10 دنانير أو أكثر في جميع أنحاء المملكة!'
              : 'Enjoy FREE shipping on all orders over 10 JOD delivered right to your doorstep!'}
          </p>
        </div>
      </div>

      {/* 3. Tabbed Products Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center justify-center border-b border-gray-200 gap-8">
          {(['new', 'featured', 'topSeller'] as TabKey[]).map((tab) => {
            const label =
              tab === 'new'
                ? dict.sections.newArrivals
                : tab === 'featured'
                ? dict.sections.featured
                : dict.sections.topSellers;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-bold text-xs uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Products Grid — instant, no loading state needed */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {lang === 'ar'
              ? 'لا توجد منتجات في هذا القسم حالياً'
              : 'No products in this section yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={lang}
                onQuickView={(p) => setSelectedQuickView(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {selectedQuickView && (
        <QuickViewModal
          product={selectedQuickView}
          locale={lang}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
};
