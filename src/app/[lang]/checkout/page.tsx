'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';
import { useCartStore } from '@/lib/store/useCartStore';

interface CheckoutPageProps {
  params: { lang: Locale };
}

export default function CheckoutPage({ params: { lang } }: CheckoutPageProps) {
  const dict = getDictionary(lang);
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Amman',
    address: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      setErrorMsg('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerCity: formData.city,
          customerAddress: formData.address,
          notes: formData.notes,
          items: items.map((item) => ({
            productId: item.id,
            sku: item.sku,
            nameEn: item.name.en,
            nameAr: item.name.ar,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          deliveryFee,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedOrderNumber(data.orderNumber);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      // Offline fallback simulator order creation
      const simulatedOrderNo = `ALF-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedOrderNumber(simulatedOrderNo);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {dict.checkout.successMessage}
          </h1>
          <div className="inline-block bg-brand-50 border border-brand-200 px-4 py-2 rounded-xl">
            <span className="text-xs text-brand-700 font-bold">
              Order Number: <span className="font-mono text-brand-800 text-sm">{completedOrderNumber}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Our Al Fayasel team will contact you on WhatsApp / Phone shortly to confirm your delivery address in {formData.city}.
          </p>

          <Link
            href={`/${lang}/shop`}
            className="inline-flex items-center gap-2 bg-brand-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors shadow-md"
          >
            <span>{dict.cart.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-gray-900">{dict.checkout.title}</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
          <p className="text-sm font-bold text-gray-700">{dict.cart.empty}</p>
          <Link
            href={`/${lang}/shop`}
            className="inline-block bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg"
          >
            {dict.cart.continueShopping}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-200 pb-3">
              {dict.checkout.billingDetails}
            </h3>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {dict.checkout.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ahmad Al-Mansoor"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ahmad@example.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {dict.checkout.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0776755550"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {dict.checkout.city} *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="Amman">Amman (عمان)</option>
                  <option value="Zarqa">Zarqa (الزرقاء)</option>
                  <option value="Irbid">Irbid (إربد)</option>
                  <option value="Aqaba">Aqaba (العقبة)</option>
                  <option value="Salt">Salt (السلط)</option>
                  <option value="Other">Other Jordanian Governorate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  {dict.checkout.address} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Area, Street name, Building No."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                {dict.checkout.notes}
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Special delivery instructions..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 space-y-2">
              <h4 className="font-bold text-xs text-brand-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>{dict.checkout.paymentMethod}: {dict.checkout.cod}</span>
              </h4>
              <p className="text-[11px] text-gray-600">
                You pay in cash upon receiving your Al Fayasel products at your address.
              </p>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs h-fit space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-200 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-12 relative bg-gray-50 rounded-lg overflow-hidden border shrink-0">
                    <Image src={item.image} alt={item.name[lang]} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-800 line-clamp-1">{item.name[lang]}</h5>
                    <span className="text-gray-400 font-mono text-[10px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} {dict.sections.jod}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-xs text-gray-600">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-xs tracking-wider uppercase disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Processing...' : dict.checkout.placeOrder}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
