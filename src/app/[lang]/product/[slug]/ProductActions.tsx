'use client';

import React, { useState } from 'react';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { ProductData } from '@/lib/data/products';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

interface ProductActionsProps {
  product: ProductData;
  locale: Locale;
}

export default function ProductActions({ product, locale }: ProductActionsProps) {
  const dict = getDictionary(locale);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);

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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
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

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-xs tracking-wider uppercase"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{dict.sections.addToCart}</span>
        </button>

        {/* Wishlist Button */}
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
          className={`p-3 rounded-xl border-2 transition-colors ${
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
  );
}
