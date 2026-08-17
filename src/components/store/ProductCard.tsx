'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import { Locale, getDictionary, getLocalizedPath } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

interface ProductCardProps {
  product: ProductData;
  locale: Locale;
  onQuickView?: (product: ProductData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  locale,
  onQuickView,
}) => {
  const dict = getDictionary(locale);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isAr = locale === 'ar';
  const isLiked = isInWishlist(product.id);

  // Calculate price range for variable products
  const variations = product.variations || [];
  const prices = variations.map((v) => v.price).filter((p) => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
  const hasPriceRange = variations.length > 0 && minPrice !== maxPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      categorySlug: product.categorySlug,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
      categorySlug: product.categorySlug,
    });
  };

  return (
    <div className="relative group w-full h-[320px] md:h-[370px] bg-transparent">
      {/* Dynamic Popover Container */}
      <div className="absolute top-0 left-0 w-full bg-white flex flex-col p-3 transition-all duration-200 z-10 group-hover:z-30 group-hover:shadow-2xl group-hover:border group-hover:border-gray-100 group-hover:rounded-b-lg">
        {/* Badges */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="bg-brand-500 text-white font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider rounded-none select-none">
              NEW
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider rounded-none select-none">
              OFFER
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={getLocalizedPath(`/product/${product.slug}`, locale)}
          className="block relative w-full aspect-square overflow-hidden bg-transparent mb-3 select-none"
        >
          {product.images && product.images.length > 1 ? (
            <>
              {/* Primary Image */}
              <Image
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name[locale]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain transition-opacity duration-500 group-hover:opacity-0"
              />
              {/* Secondary Image on Hover */}
              <Image
                src={product.images[1]}
                alt={product.name[locale]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain absolute inset-0 opacity-0 transition-all duration-500 transform group-hover:opacity-100 group-hover:scale-105"
              />
            </>
          ) : (
            /* Single Image with Zoom-in on Hover */
            <Image
              src={product.images && product.images[0] ? product.images[0] : '/images/placeholder.jpg'}
              alt={product.name[locale]}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain transition-transform duration-500 transform group-hover:scale-110"
            />
          )}
        </Link>

        {/* Product Title */}
        <Link href={getLocalizedPath(`/product/${product.slug}`, locale)} className="text-center block mb-1">
          <h3 className="font-medium text-[13px] text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 leading-snug px-1">
            {product.name[locale]}
          </h3>
        </Link>

        {/* Product Price */}
        <div className="flex items-center justify-center gap-1.5 pb-1">
          {product.originalPrice && !hasPriceRange && (
            <span className="text-xs text-gray-400 line-through font-normal">
              {product.originalPrice.toFixed(2)} {isAr ? 'د.أ.' : 'JOD'}
            </span>
          )}
          {hasPriceRange ? (
            <span className="font-bold text-[12px] text-[#0066b2]">
              {minPrice.toFixed(2)} - {maxPrice.toFixed(2)} {isAr ? 'د.أ.' : 'JOD'}
            </span>
          ) : (
            <span className="font-bold text-[13px] text-[#0066b2]">
              {product.price.toFixed(2)} {isAr ? 'د.أ.' : 'JOD'}
            </span>
          )}
        </div>

        {/* Hover Summary & Action row (Visible only on hover) */}
        <div className="hidden group-hover:block transition-all duration-300 w-full pt-3 border-t border-gray-100 mt-1.5">
          {/* Description summary (Stripped of raw HTML tags) */}
          <p className="text-[11px] text-gray-500 text-center line-clamp-3 leading-relaxed mb-3 font-normal px-2">
            {product.description[locale]
              ? product.description[locale]
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
              : ''}
          </p>

          {/* Action buttons (Ordered for correct RTL/LTR rendering) */}
          <div className="flex items-center justify-between gap-2">
            {/* 1. Wishlist (Renders: Right in RTL / Left in LTR) */}
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 border flex items-center justify-center transition-colors cursor-pointer rounded-none shrink-0 ${
                isLiked
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-gray-200 hover:border-rose-500 hover:text-rose-500 text-gray-400'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* 2. Add to Cart (Middle) */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-9 bg-[#0066b2] hover:bg-[#005594] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none"
            >
              <span>{isAr ? 'إضافة إلى السلة' : 'ADD TO CART'}</span>
            </button>

            {/* 3. Quick View - Search Icon (Renders: Left in RTL / Right in LTR) */}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="w-9 h-9 border border-gray-200 hover:border-brand-500 hover:text-brand-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer bg-white rounded-none shrink-0"
                title={dict.sections.quickView}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
