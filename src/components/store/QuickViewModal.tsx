'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Heart, Star, CheckCircle, Shield } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

interface QuickViewModalProps {
  product: ProductData | null;
  locale: Locale;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  locale,
  onClose,
}) => {
  const dict = getDictionary(locale);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.images[0],
        categorySlug: product.categorySlug,
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Window */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 end-3 z-20 p-1.5 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-gray-50 min-h-[300px]">
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover"
          />
        </div>

        {/* Right: Product Specs */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              {product.categoryName[locale]}
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
              {product.name[locale]}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 font-mono">({product.reviewCount} {dict.product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-extrabold text-brand-600">
                {product.price.toFixed(2)} {dict.sections.jod}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} {dict.sections.jod}
                </span>
              )}
            </div>

            {/* Description Excerpt (Stripped of raw HTML tags) */}
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed border-t border-gray-100 pt-3">
              {product.description[locale]
                ? product.description[locale]
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                : ''}
            </p>
          </div>

          {/* Stock status badge */}
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{dict.sections.inStock} ({product.stockQuantity} available)</span>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors text-xs uppercase tracking-wider"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{dict.sections.addToCart}</span>
              </button>

              <button
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    categorySlug: product.categorySlug,
                  })
                }
                className={`p-2.5 rounded-lg border transition-colors ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-gray-300 text-gray-600 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg">
            <Shield className="w-4 h-4 text-brand-500" />
            <span>Original Al Fayasel Laboratories product with quality certificate.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
