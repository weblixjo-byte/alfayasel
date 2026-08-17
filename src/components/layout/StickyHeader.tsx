'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

interface StickyHeaderProps {
  locale: Locale;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({ locale }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === 'ar';
  const { getItemCount, getSubtotal, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLanguageSwitcherPath = () => {
    const queryString = searchParams?.toString();
    const querySuffix = queryString ? `?${queryString}` : '';

    if (isAr) {
      // Switch from Arabic to English
      let newPath = pathname;
      if (pathname === '/ar') {
        newPath = '/';
      } else if (pathname.startsWith('/ar/')) {
        newPath = pathname.substring(3);
      }
      return `${newPath}${querySuffix}`;
    } else {
      // Switch from English to Arabic
      const newPath = pathname === '/' ? '/ar' : `/ar${pathname}`;
      return `${newPath}${querySuffix}`;
    }
  };

  const isActive = (path: string) => {
    const localizedPath = getLocalizedPath(path, locale);
    if (path === '/') {
      return pathname === localizedPath || pathname === `${localizedPath}/`;
    }
    return pathname.startsWith(localizedPath);
  };

  const SaFlag = () => (
    <div className="w-5 h-3.5 relative overflow-hidden border border-gray-200 flex-shrink-0 select-none shadow-3xs">
      <svg width="100%" height="100%" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="12" fill="#006C35" />
        <path d="M5 8.5H13M12.5 7.5V9.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M5.5 5C5.8 4 7 4.2 7 5C7 5.8 8.2 6 8.5 5M9 5c.3-1 1.5-.8 1.5 0c0 .8 1.2 1 1.5 0" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
      </svg>
    </div>
  );

  const UsFlag = () => (
    <div className="w-5 h-3.5 relative overflow-hidden border border-gray-200 flex-shrink-0 select-none shadow-3xs">
      <svg width="100%" height="100%" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="12" fill="white" />
        <rect width="18" height="1.2" fill="#B22234" />
        <rect y="2.4" width="18" height="1.2" fill="#B22234" />
        <rect y="4.8" width="18" height="1.2" fill="#B22234" />
        <rect y="7.2" width="18" height="1.2" fill="#B22234" />
        <rect y="9.6" width="18" height="1.2" fill="#B22234" />
        <rect y="10.8" width="18" height="1.2" fill="#B22234" />
        <rect width="8" height="6.5" fill="#3C3B6E" />
        <circle cx="1.5" cy="1.5" r="0.4" fill="white" />
        <circle cx="3.5" cy="1.5" r="0.4" fill="white" />
        <circle cx="5.5" cy="1.5" r="0.4" fill="white" />
        <circle cx="2.5" cy="2.8" r="0.4" fill="white" />
        <circle cx="4.5" cy="2.8" r="0.4" fill="white" />
        <circle cx="1.5" cy="4.1" r="0.4" fill="white" />
        <circle cx="3.5" cy="4.1" r="0.4" fill="white" />
        <circle cx="5.5" cy="4.1" r="0.4" fill="white" />
        <circle cx="2.5" cy="5.4" r="0.4" fill="white" />
        <circle cx="4.5" cy="5.4" r="0.4" fill="white" />
      </svg>
    </div>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-[100] border-b border-gray-100 transition-all duration-300 transform select-none ${
        isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* 1. Official Al Fayasel Logo (Left in LTR / Right in RTL) */}
        <Link href={getLocalizedPath('/', locale)} className="flex items-center shrink-0">
          <div className="relative h-10 w-36">
            <Image
              src="/images/alfayasel-logo-new-02.png"
              alt="AL Fayasel | مختبرات الفياصل"
              fill
              className={`object-contain ${isAr ? 'object-right' : 'object-left'}`}
            />
          </div>
        </Link>

        {/* 2. Menu Links (Center) - Desktop only */}
        <div className="hidden md:flex items-center gap-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-800">
          <Link
            href={getLocalizedPath('/', locale)}
            className={`py-3.5 transition-colors font-bold ${
              isActive('/') ? 'text-[#0066b2]' : 'text-gray-800 hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'الرئيسية' : 'HOME'}
          </Link>
          <Link
            href={getLocalizedPath('/our-products', locale)}
            className={`py-3.5 transition-colors font-bold ${
              isActive('/our-products') ? 'text-[#0066b2]' : 'text-gray-800 hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'منتجاتنا' : 'OUR PRODUCTS'}
          </Link>
          <Link
            href={getLocalizedPath('/about-us', locale)}
            className={`py-3.5 transition-colors font-bold ${
              isActive('/about-us') ? 'text-[#0066b2]' : 'text-gray-800 hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'من نحن' : 'ABOUT US'}
          </Link>
          <Link
            href={getLocalizedPath('/contact-us', locale)}
            className={`py-3.5 transition-colors font-bold ${
              isActive('/contact-us') ? 'text-[#0066b2]' : 'text-gray-800 hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'اتصل بنا' : 'CONTACT US'}
          </Link>
          <Link
            href={getLocalizedPath('/our-certificates', locale)}
            className={`py-3.5 transition-colors font-bold ${
              isActive('/our-certificates') ? 'text-[#0066b2]' : 'text-gray-800 hover:text-[#0066b2]'
            }`}
          >
            {isAr ? 'شهاداتنا' : 'OUR CERTIFICATES'}
          </Link>
          {/* Language Switcher */}
          <Link
            href={getLanguageSwitcherPath()}
            className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors flex items-center gap-1.5"
          >
            {isAr ? (
              <>
                <UsFlag />
                <span>ENGLISH</span>
              </>
            ) : (
              <>
                <SaFlag />
                <span>ARABIC</span>
              </>
            )}
          </Link>
        </div>

        {/* 3. Account / Cart / Wishlist Actions (Right in LTR / Left in RTL) */}
        <div className="flex items-center gap-4 text-xs font-bold text-gray-800 shrink-0">
          <Link
            href="/admin/login"
            className="hidden md:block hover:text-[#0066b2] transition-colors uppercase tracking-wider text-[11px] font-bold"
          >
            LOGIN / REGISTER
          </Link>

          {/* Wishlist */}
          <Link
            href={getLocalizedPath('/wishlist', locale)}
            className="relative p-1 text-gray-800 hover:text-[#0066b2] transition-colors flex items-center"
            title="Wishlist"
          >
            <Heart className="w-4.5 h-4.5 stroke-[1.8]" />
            <span className="absolute -top-1 -end-1.5 bg-[#0066b2] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {wishlistCount}
            </span>
          </Link>

          {/* Language Switcher Flag */}
          <Link
            href={getLanguageSwitcherPath()}
            className="p-1 hover:opacity-80 transition-opacity flex items-center shrink-0"
            title={isAr ? 'Switch to English' : 'تحويل للعربية'}
          >
            {isAr ? <UsFlag /> : <SaFlag />}
          </Link>

          {/* Cart */}
          <div
            onClick={openCart}
            className="flex items-center gap-1.5 text-gray-800 hover:text-[#0066b2] transition-colors cursor-pointer"
          >
            <div className="relative p-1">
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.8]" />
              <span className="absolute -top-1 -end-1.5 bg-[#0066b2] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {getItemCount()}
              </span>
            </div>
            <span className="hidden sm:block font-extrabold text-[11px] tracking-tight">
              {getSubtotal().toFixed(3)} {isAr ? 'د.أ.' : 'JOD'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SaFlag = () => (
  <div className="w-5 h-3.5 relative overflow-hidden border border-gray-200 flex-shrink-0 select-none shadow-3xs">
    <svg width="100%" height="100%" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="18" height="12" fill="#006C35" />
      <path d="M5 8.5H13M12.5 7.5V9.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M5.5 5C5.8 4 7 4.2 7 5C7 5.8 8.2 6 8.5 5M9 5c.3-1 1.5-.8 1.5 0c0 .8 1.2 1 1.5 0" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  </div>
);

const UsFlag = () => (
  <div className="w-5 h-3.5 relative overflow-hidden border border-gray-200 flex-shrink-0 select-none shadow-3xs">
    <svg width="100%" height="100%" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="18" height="12" fill="white" />
      <rect width="18" height="1.2" fill="#B22234" />
      <rect y="2.4" width="18" height="1.2" fill="#B22234" />
      <rect y="4.8" width="18" height="1.2" fill="#B22234" />
      <rect y="7.2" width="18" height="1.2" fill="#B22234" />
      <rect y="9.6" width="18" height="1.2" fill="#B22234" />
      <rect y="10.8" width="18" height="1.2" fill="#B22234" />
      <rect width="8" height="6.5" fill="#3C3B6E" />
      <circle cx="1.5" cy="1.5" r="0.4" fill="white" />
      <circle cx="3.5" cy="1.5" r="0.4" fill="white" />
      <circle cx="5.5" cy="1.5" r="0.4" fill="white" />
      <circle cx="2.5" cy="2.8" r="0.4" fill="white" />
      <circle cx="4.5" cy="2.8" r="0.4" fill="white" />
      <circle cx="1.5" cy="4.1" r="0.4" fill="white" />
      <circle cx="3.5" cy="4.1" r="0.4" fill="white" />
      <circle cx="5.5" cy="4.1" r="0.4" fill="white" />
      <circle cx="2.5" cy="5.4" r="0.4" fill="white" />
      <circle cx="4.5" cy="5.4" r="0.4" fill="white" />
    </svg>
  </div>
);
