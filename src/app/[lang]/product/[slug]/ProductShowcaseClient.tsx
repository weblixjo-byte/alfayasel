'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, CheckCircle, Truck, Heart, ShoppingCart, Plus, Minus, Shield } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ProductShowcaseClientProps {
  product: ProductData;
  locale: Locale;
  initialVariationSku?: string;
}

export default function ProductShowcaseClient({ product, locale, initialVariationSku }: ProductShowcaseClientProps) {
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';
  
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawVariations = product.variations || [];
  
  // Check if rawVariations already includes base SKU/price
  const hasBaseInVariations = rawVariations.some(
    (v) => v.sku === product.sku || (v.price === product.price && (!v.sku || v.sku === product.sku))
  );

  const baseOption = {
    sku: product.sku || 'main-sku',
    name: { ar: 'الحجم الأساسي', en: 'Standard Size' },
    price: product.price,
    originalPrice: product.originalPrice,
    inStock: product.inStock,
    stockQuantity: product.stockQuantity,
    images: product.images,
    description: product.description,
  };

  const variations = (rawVariations.length > 0 && !hasBaseInVariations)
    ? [baseOption, ...rawVariations]
    : rawVariations;

  const hasVariations = variations.length > 0;

  // State for selected variation SKU (defaults to base product or URL param or first variation)
  const [selectedVariationSku, setSelectedVariationSku] = useState<string>(() => {
    if (initialVariationSku && variations.some(v => v.sku === initialVariationSku)) {
      return initialVariationSku;
    }
    // Default to main product SKU if present, or first variation
    const baseMatch = variations.find(v => v.sku === product.sku || v.price === product.price);
    return baseMatch ? baseMatch.sku : (variations[0]?.sku || product.sku);
  });

  // Find matching variation based on selected SKU
  const activeVariation = variations.find((v) => v.sku === selectedVariationSku) || variations[0];

  // Resolve active price, sku, images, stock status, and description
  const currentSKU = activeVariation ? activeVariation.sku : product.sku;
  const currentPrice = activeVariation ? activeVariation.price : product.price;
  const currentOriginalPrice = activeVariation ? activeVariation.originalPrice : product.originalPrice;
  const inStock = activeVariation ? activeVariation.inStock : product.inStock;
  const stockQuantity = activeVariation ? activeVariation.stockQuantity : product.stockQuantity;
  
  const currentDescription = activeVariation?.description?.[locale]
    ? activeVariation.description[locale]
    : product.description[locale];

  // Resolve images
  const variationImages = activeVariation?.images || [];
  const displayedImage = variationImages.length > 0 ? variationImages[0] : (product.images[activeImageIndex] || '/images/placeholder.jpg');

  // Build price range for default view
  const prices = variations.map((v) => v.price).filter((p) => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
  const hasPriceRange = hasVariations && minPrice !== maxPrice;

  const isLiked = isInWishlist(product.id);

  const handleVariationChange = (sku: string) => {
    setSelectedVariationSku(sku);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sku', sku);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = () => {
    // Build bilingual name for variation to show size/type in cart item description
    const variationSuffix = activeVariation && activeVariation.name
      ? ` (${activeVariation.name[locale]})`
      : '';

    const nameWithVariant = {
      en: `${product.name.en}${variationSuffix}`,
      ar: `${product.name.ar}${variationSuffix}`,
    };

    addItem(
      {
        id: product.id,
        sku: currentSKU,
        name: nameWithVariant,
        price: currentPrice,
        image: variationImages.length > 0 ? variationImages[0] : (product.images[0] || '/images/placeholder.jpg'),
        categorySlug: product.categorySlug,
      },
      quantity
    );
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
          <Image
            src={displayedImage}
            alt={product.name[locale]}
            fill
            priority
            className="object-contain hover:scale-105 transition-transform duration-500 p-4"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {product.images.map((img, idx) => {
              const isSelected = displayedImage === img;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                  }}
                  className={`relative w-20 h-20 bg-white rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-[#0066b2] scale-95 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-1" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Specs & Actions */}
      <div className="space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {product.categoryName[locale]}
            </span>
            <span className="text-xs font-mono text-gray-400">
              SKU: {currentSKU}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            {product.name[locale]}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-gray-500 font-mono">
              ({product.rating} / 5.0 - {product.reviewCount} {dict.product.reviews})
            </span>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline gap-4 pt-2">
            {hasPriceRange && !activeVariation ? (
              <span className="text-2xl md:text-3xl font-extrabold text-brand-600">
                {minPrice.toFixed(2)} - {maxPrice.toFixed(2)} {dict.sections.jod}
              </span>
            ) : (
              <span className="text-3xl font-extrabold text-[#0066b2]">
                {currentPrice.toFixed(2)} {dict.sections.jod}
              </span>
            )}
            
            {currentOriginalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {currentOriginalPrice.toFixed(2)} {dict.sections.jod}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className={`flex items-center gap-2 text-xs font-semibold w-fit px-3 py-1.5 rounded-lg border ${
            inStock 
              ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
              : 'text-rose-600 bg-rose-50 border-rose-200'
          }`}>
            <CheckCircle className={`w-4 h-4 ${inStock ? 'text-emerald-500' : 'text-rose-500'}`} />
            <span>
              {inStock 
                ? `${dict.sections.inStock} (${stockQuantity} ${isAr ? 'متوفر' : 'items available'})` 
                : (isAr ? 'غير متوفر في المخزون' : 'Out of stock')}
            </span>
          </div>

          {/* Variations Selector */}
          {hasVariations && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  {isAr ? 'اختر الخيار' : 'Select Option'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {variations.map((v) => {
                    const isSelected = selectedVariationSku === v.sku;
                    const label = v.name?.[locale] || v.sku;
                    return (
                      <button
                        key={v.sku}
                        onClick={() => handleVariationChange(v.sku)}
                        className={`px-4 py-2.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0066b2] border-[#0066b2] text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Excerpt Description */}
          <div 
            className="text-xs md:text-sm text-gray-600 leading-relaxed border-t border-b border-gray-100 py-4 font-normal"
            dangerouslySetInnerHTML={{ __html: currentDescription }}
          />

          {/* Actions: Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            
            {/* Mobile Top Row: Quantity + Wishlist side-by-side */}
            <div className="flex items-center gap-3 sm:gap-0">
              {/* Quantity Controls */}
              <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-extrabold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Button - Mobile Only */}
              <button
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    sku: currentSKU,
                    name: product.name,
                    price: currentPrice,
                    image: product.images[0],
                    categorySlug: product.categorySlug,
                  })
                }
                className={`sm:hidden p-3 rounded-xl border-2 transition-colors cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-gray-300 text-gray-600 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Add to Cart Button - full width on mobile, flex-1 on desktop */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full sm:flex-1 text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-xs tracking-wider uppercase ${
                inStock 
                  ? 'bg-[#0066b2] hover:bg-[#005594] hover:shadow-xl cursor-pointer' 
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{dict.sections.addToCart}</span>
            </button>

            {/* Wishlist Button - Desktop Only */}
            <button
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  sku: currentSKU,
                  name: product.name,
                  price: currentPrice,
                  image: product.images[0],
                  categorySlug: product.categorySlug,
                })
              }
              className={`hidden sm:block p-3 rounded-xl border-2 transition-colors cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'border-gray-300 text-gray-600 hover:text-rose-500'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quality Certification */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-150">
          <Shield className="w-5 h-5 text-brand-500 shrink-0" />
          <span>
            {isAr 
              ? 'منتج أصلي 100% من مختبرات الفياصل الدوائية ومصنع بترخيص رسمي للرقابة الطبية.' 
              : 'Original 100% Al Fayasel Laboratories product manufactured under official health authorities supervision.'}
          </span>
        </div>
      </div>
    </div>
  );
}
