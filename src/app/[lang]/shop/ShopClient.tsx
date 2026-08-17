'use client';

import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { INITIAL_CATEGORIES, ProductData } from '@/lib/data/products';
import { ProductCard } from '@/components/store/ProductCard';
import { QuickViewModal } from '@/components/store/QuickViewModal';

interface ShopClientProps {
  lang: Locale;
  initialProducts: ProductData[];
  initialCategory: string;
  initialQuery: string;
}

export function ShopClient({ lang, initialProducts, initialCategory, initialQuery }: ShopClientProps) {
  const dict = getDictionary(lang);
  const isAr = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'newest'>('featured');
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        if (selectedCategory && p.categorySlug !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          if (!matchName && !matchSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return 0;
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filter + Sort Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selectedCategory === ''
                ? 'bg-[#0066b2] text-white border-[#0066b2]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#0066b2] hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#0066b2] text-white border-[#0066b2]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#0066b2] hover:text-[#0066b2]'
              }`}
            >
              {cat.name[lang]}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث...' : 'Search...'}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-32 md:w-44 focus:outline-none focus:border-[#0066b2]"
          />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="border border-gray-200 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0066b2] bg-white"
          >
            <option value="featured">{isAr ? 'الأبرز' : 'Featured'}</option>
            <option value="priceAsc">{isAr ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
            <option value="priceDesc">{isAr ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
            <option value="newest">{isAr ? 'الأحدث' : 'Newest'}</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500">
        {dict.filter.showing}{' '}
        <span className="font-bold text-[#0066b2]">{filteredProducts.length}</span>{' '}
        {dict.filter.results}
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 border border-gray-200 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {isAr ? 'لا توجد منتجات' : 'No products found'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {isAr
              ? 'جرب تغيير معايير البحث أو امسح الفلاتر'
              : 'Try adjusting your search or clearing filters.'}
          </p>
          <button
            onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSortBy('featured'); }}
            className="bg-[#0066b2] text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#005594] transition-colors"
          >
            {dict.filter.clearAll}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={lang}
              onQuickView={(p) => setSelectedQuickView(p)}
            />
          ))}
        </div>
      )}

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
}
