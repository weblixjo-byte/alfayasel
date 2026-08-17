'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Locale, getDictionary, getLocalizedPath } from '@/lib/i18n/config';
import { useCartStore } from '@/lib/store/useCartStore';

interface CartDrawerProps {
  locale: Locale;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ locale }) => {
  const dict = getDictionary(locale);
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getTotal,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const freeShippingThreshold = 10;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        {/* Slide-over panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-end duration-300">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2 font-bold text-brand-700 text-sm">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              <span>{dict.cart.title} ({items.length})</span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-4 py-3 bg-brand-50/70 border-b border-brand-100 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                🎉 {dict.cart.freeDelivery}
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-brand-800">
                  Add <span className="font-bold text-brand-600">{remainingForFreeShipping.toFixed(2)} {dict.sections.jod}</span> more for <span className="font-bold text-emerald-600">FREE delivery</span>!
                </p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-gray-700 text-sm">{dict.cart.empty}</p>
                <button
                  onClick={closeCart}
                  className="bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  {dict.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-3 flex gap-3 items-center">
                  <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name[locale]}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-gray-800 line-clamp-1">
                      {item.name[locale]}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono">
                      SKU: {item.sku}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 transition-colors text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 transition-colors text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-end">
                        <span className="font-extrabold text-xs text-brand-600">
                          {(item.price * item.quantity).toFixed(2)} {dict.sections.jod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                    title={dict.cart.remove}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{dict.cart.subtotal}</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} {dict.sections.jod}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{dict.cart.deliveryFee}</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {deliveryFee === 0 ? dict.cart.freeDelivery : `${deliveryFee.toFixed(2)} ${dict.sections.jod}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                  <span>{dict.cart.total}</span>
                  <span className="text-brand-600 text-base">{total.toFixed(2)} {dict.sections.jod}</span>
                </div>
              </div>

              <Link
                href={getLocalizedPath('/checkout', locale)}
                onClick={closeCart}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs tracking-wider uppercase"
              >
                <span>{dict.cart.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
