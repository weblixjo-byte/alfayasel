'use client';

import React, { useEffect, useState } from 'react';
import { Locale, getDictionary, getLocalizedPath } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { ProductCard } from '@/components/store/ProductCard';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { Heart, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WishlistClientProps {
  lang: Locale;
  allProducts: ProductData[];
}

export function WishlistClient({ lang, allProducts }: WishlistClientProps) {
  const dict = getDictionary(lang);
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const wishlistItems = useWishlistStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter all products by wishlist items
  const favoriteProducts = mounted
    ? allProducts.filter((p) => wishlistItems.some((item) => item.id === p.id))
    : [];

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#0066b2] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {isAr ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-md mx-auto font-normal">
            {isAr
              ? 'يبدو أنك لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. تصفح متجرنا وابدأ بإضافة منتجاتك المفضلة الآن!'
              : 'You haven\'t added any products to your wishlist yet. Browse our catalog and start adding your favorites!'}
          </p>
        </div>
        <Link
          href={getLocalizedPath('/our-products', lang)}
          className="inline-flex items-center gap-2 bg-[#0066b2] hover:bg-[#005594] text-white text-xs font-bold px-6 py-3.5 transition-colors uppercase tracking-wider shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isAr ? 'تصفح منتجاتنا' : 'Browse Our Products'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#0066b2] uppercase tracking-widest block">
            {isAr ? 'قائمتك الخاصة' : 'YOUR PERSONAL SELECTION'}
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isAr ? 'المنتجات المفضلة' : 'Favorite Products'}
          </h1>
        </div>
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider border-t md:border-t-0 md:border-s border-gray-300 pt-3 md:pt-0 md:ps-6">
          {favoriteProducts.length} {isAr ? 'منتج مضاف' : 'items added'}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={lang} />
        ))}
      </div>
    </div>
  );
}
