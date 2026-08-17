'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { useCartStore } from '@/lib/store/useCartStore';

interface CartPageProps {
  params: { lang: Locale };
}

export default function CartPage({ params: { lang } }: CartPageProps) {
  const dict = getDictionary(lang);
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTotal, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-brand-500" />
          <span>{dict.cart.title}</span>
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{dict.cart.empty}</h2>
          <Link
            href={`/${lang}/shop`}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <span>{dict.cart.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <Image src={item.image} alt={item.name[lang]} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{item.name[lang]}</h3>
                    <span className="text-xs text-gray-400 font-mono">SKU: {item.sku}</span>
                    <p className="text-xs text-brand-600 font-bold mt-1">
                      {item.price.toFixed(2)} {dict.sections.jod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 ms-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-bold text-sm text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <span className="font-extrabold text-base text-gray-900 min-w-[80px] text-end">
                    {(item.price * item.quantity).toFixed(2)} {dict.sections.jod}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-rose-600 p-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{dict.cart.subtotal}</span>
                <span className="font-bold">{subtotal.toFixed(2)} {dict.sections.jod}</span>
              </div>
              <div className="flex justify-between">
                <span>{dict.cart.deliveryFee}</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {deliveryFee === 0 ? dict.cart.freeDelivery : `${deliveryFee.toFixed(2)} ${dict.sections.jod}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-3">
                <span>{dict.cart.total}</span>
                <span className="text-brand-600">{total.toFixed(2)} {dict.sections.jod}</span>
              </div>
            </div>

            <Link
              href={`/${lang}/checkout`}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-xs tracking-wider uppercase"
            >
              <span>{dict.cart.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
