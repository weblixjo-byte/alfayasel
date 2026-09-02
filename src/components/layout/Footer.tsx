'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Printer,
  ChevronUp,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';

interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const isAr = locale === 'ar';

  const usefulLinks = [
    { href: '/our-products', label: isAr ? 'منتجاتنا' : 'Our Products' },
    { href: '/about-us', label: isAr ? 'من نحن' : 'About Us' },
    { href: '/our-certificates', label: isAr ? 'شهاداتنا' : 'Our Certificates' },
    { href: '/contact-us', label: isAr ? 'اتصل بنا' : 'Contact Us' },
  ];

  const policyLinks = [
    { href: '/privacy-policy-3', label: isAr ? 'سياسة الخصوصية' : 'Privacy Policy' },
    { href: '/return-policy', label: isAr ? 'سياسة المرتجعات' : 'Return Policy' },
    { href: '/cancellation-policy', label: isAr ? 'سياسة الإلغاء' : 'Cancellation Policy' },
    { href: '/terms-and-conditions', label: isAr ? 'الشروط والأحكام' : 'Terms & Conditions' },
  ];

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <footer dir={isAr ? 'rtl' : 'ltr'} className="bg-[#08090a] text-white border-t border-neutral-900">

      {/* ── Main Footer Body ── */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            {/* Logo */}
            <Link href={getLocalizedPath('/', locale)} className="inline-block">
              <div className="relative h-14 w-48 bg-white rounded-xl p-2">
                <Image
                  src="/images/alfayasel-logo-new-02.png"
                  alt="Al Fayasel Laboratories"
                  fill
                  className={`object-contain ${isAr ? 'object-right' : 'object-left'} p-2`}
                />
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {isAr
                ? 'مختبرات الفياصل الدوائية — رائدة في مجال المستحضرات الطبية والتجميلية عالية الجودة.'
                : 'Al Fayasel Laboratories — leaders in premium pharmaceutical and cosmetic products.'}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
                { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://wa.me/962776755550', icon: MessageCircle, label: 'WhatsApp' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0066b2] hover:border-[#0066b2] hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Useful Links */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0066b2]">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {usefulLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={getLocalizedPath(href, locale)}
                    prefetch={false}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                  >
                    <Arrow className="w-3 h-3 text-[#0066b2] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Policies */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0066b2]">
              {isAr ? 'السياسات' : 'Policies'}
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={getLocalizedPath(href, locale)}
                    prefetch={false}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                  >
                    <Arrow className="w-3 h-3 text-[#0066b2] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0066b2]">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-[#0066b2] shrink-0 mt-0.5" />
                <span>{isAr ? 'عمان — الدوار السابع' : 'Amman, Seventh Circle'}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#0066b2] shrink-0" />
                <a href="tel:009625810818" className="hover:text-white transition-colors ltr" dir="ltr">
                  +962 6 581 0818
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4 text-[#0066b2] shrink-0" />
                <a href="https://wa.me/962776755550" className="hover:text-white transition-colors ltr" dir="ltr">
                  +962 77 675 5550
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Printer className="w-4 h-4 text-[#0066b2] shrink-0" />
                <span dir="ltr">+962 6 582 9837</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-neutral-900" />

      {/* ── Bottom Bar ── */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright & Credit */}
        <div className="text-xs text-gray-500 order-2 sm:order-1 flex items-center gap-2 flex-wrap">
          <span>© {new Date().getFullYear()} Al Fayasel Laboratories. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <span className="text-gray-400">
            Created by{' '}
            <a
              href="https://weblix-jo.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0066b2] hover:underline transition-opacity hover:opacity-90"
            >
              Weblix-jo
            </a>
          </span>
        </div>

        {/* Payment Icons */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          {/* Visa */}
          <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center">
            <svg width="26" height="9" viewBox="0 0 26 9" fill="none">
              <path d="M9.5 8.2L10.8.3h2L11.5 8.2H9.5ZM17 .4c-.4-.2-1-.3-1.8-.3-2 0-3.4 1-3.4 2.5 0 1.1 1 1.7 1.8 2.1.8.4 1.1.6 1.1 1 0 .6-.7.8-1.3.8-.9 0-1.5-.2-1.9-.4l-.4 1.5c.4.2 1.3.3 2.1.3 2.1 0 3.5-1 3.5-2.6 0-2-2.8-2.1-2.8-2.9 0-.2.2-.5.8-.6.3 0 .9-.1 1.6.1L17 .4ZM21.5.3H20c-.5 0-.9.3-1.1.7l-2.3 5.4h2l.4-1.2h2.5l.2 1.2H23.5L21.5.3ZM19.6 4l.7-1.9.4 1.9h-1.1ZM7.8.3H6L4.2 4.4 3.8.5c-.1-.1-.3-.2-.5-.2H.3V.5C2 .9 3.1 1.8 3.6 3.2L5.9 8.2H8L9.2.3H7.8Z" fill="white"/>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <circle cx="8" cy="7" r="6" fill="#EB001B"/>
              <circle cx="14" cy="7" r="6" fill="#F79E1B" fillOpacity="0.85"/>
            </svg>
          </div>
          {/* PayPal */}
          <div className="w-10 h-6 bg-[#003087] rounded flex items-center justify-center">
            <span className="text-[8px] font-extrabold italic text-white tracking-tight">Pay<span className="text-[#009cde]">Pal</span></span>
          </div>
          {/* Amex */}
          <div className="w-10 h-6 bg-[#016FD0] rounded flex items-center justify-center">
            <span className="text-[7px] font-extrabold text-white tracking-widest">AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
