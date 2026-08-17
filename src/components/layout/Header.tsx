'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, ChevronDown, X, Menu } from 'lucide-react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { INITIAL_CATEGORIES } from '@/lib/data/products';
import { usePathname, useSearchParams } from 'next/navigation';

interface HeaderProps {
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ locale }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === 'ar';
  const { getItemCount, getSubtotal, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLanguageSwitcherPath = () => {
    const queryString = searchParams?.toString();
    const querySuffix = queryString ? `?${queryString}` : '';
    if (locale === 'ar') {
      let newPath = pathname;
      if (pathname === '/ar') newPath = '/';
      else if (pathname.startsWith('/ar/')) newPath = pathname.substring(3);
      return `${newPath}${querySuffix}`;
    } else {
      const newPath = pathname === '/' ? '/ar' : `/ar${pathname}`;
      return `${newPath}${querySuffix}`;
    }
  };

  const navLinks = [
    { href: '/', label: isAr ? 'الرئيسية' : 'HOME' },
    { href: '/our-products', label: isAr ? 'منتجاتنا' : 'OUR PRODUCTS' },
    { href: '/about-us', label: isAr ? 'من نحن' : 'ABOUT US' },
    { href: '/contact-us', label: isAr ? 'اتصل بنا' : 'CONTACT US' },
    { href: '/our-certificates', label: isAr ? 'شهاداتنا' : 'OUR CERTIFICATES' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCategory) return;
    const query = new URLSearchParams();
    if (searchQuery.trim()) query.set('q', searchQuery.trim());
    if (selectedCategory) query.set('category', selectedCategory);
    router.push(getLocalizedPath(`/shop?${query.toString()}`, locale));
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 select-none" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={getLocalizedPath('/', locale)} className="flex items-center shrink-0">
          <div className="relative h-12 w-36 md:h-14 md:w-48">
            <Image
              src="/images/alfayasel-logo-new-02.png"
              alt="AL Fayasel | مختبرات الفياصل"
              fill
              priority
              className={`object-contain ${isAr ? 'object-right' : 'object-left'}`}
            />
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          dir={isAr ? 'rtl' : 'ltr'}
          className="flex-1 max-w-xl hidden md:flex items-center border border-gray-200 bg-white h-10 focus-within:border-gray-400"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن منتج' : 'Search for products'}
            className="flex-1 px-4 text-[11px] text-gray-700 focus:outline-none placeholder:text-gray-400 font-normal h-full bg-transparent border-0"
          />
          <div className="relative flex items-center h-full border-s border-gray-200 px-3.5 bg-transparent shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent text-[10px] font-bold text-gray-500 pe-6 focus:outline-none cursor-pointer uppercase tracking-wider border-0"
            >
              <option value="">SELECT CATEGORY</option>
              {INITIAL_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name[locale]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute end-2 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="h-full px-3.5 border-s border-gray-200 text-gray-500 hover:text-[#0066b2] transition-colors flex items-center justify-center cursor-pointer bg-transparent shrink-0"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* LOGIN REGISTER - hidden on mobile */}
          <Link
            href="/admin/login"
            className="hidden md:block hover:text-[#0066b2] transition-colors uppercase tracking-wider text-[11px] font-bold text-gray-800"
          >
            LOGIN / REGISTER
          </Link>

          {/* Wishlist */}
          <Link
            href={getLocalizedPath('/wishlist', locale)}
            className="relative p-1.5 text-gray-800 hover:text-[#0066b2] transition-colors flex items-center"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -end-1 bg-[#0066b2] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Language Switcher Flag */}
          <Link
            href={getLanguageSwitcherPath()}
            className="p-1.5 hover:opacity-80 transition-opacity flex items-center shrink-0"
            title={isAr ? 'Switch to English' : 'تحويل للعربية'}
          >
            {isAr ? <UsFlag /> : <SaFlag />}
          </Link>

          {/* Cart */}
          <div
            onClick={openCart}
            className="flex items-center gap-1.5 text-gray-800 hover:text-[#0066b2] transition-colors cursor-pointer"
          >
            <div className="relative p-1.5">
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-0.5 -end-1 bg-[#0066b2] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {getItemCount()}
              </span>
            </div>
            <span className="hidden sm:block font-extrabold text-[11px] tracking-tight">
              {getSubtotal().toFixed(3)} {isAr ? 'د.أ.' : 'JOD'}
            </span>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#0066b2] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          dir={isAr ? 'rtl' : 'ltr'}
          className="flex items-center border border-gray-200 bg-white h-10 w-full focus-within:border-gray-400"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن منتج...' : 'Search for products...'}
            className="flex-1 px-3 text-[12px] text-gray-700 focus:outline-none placeholder:text-gray-400 font-normal h-full bg-transparent border-0"
          />
          <button
            type="submit"
            className="h-full px-3 border-s border-gray-200 text-gray-500 hover:text-[#0066b2] transition-colors flex items-center justify-center cursor-pointer bg-transparent shrink-0"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </form>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedPath(link.href, locale)}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-2 text-sm font-bold text-gray-800 hover:text-[#0066b2] hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-2 text-sm font-bold text-gray-600 hover:text-[#0066b2] hover:bg-gray-50 transition-colors"
            >
              LOGIN / REGISTER
            </Link>
          </nav>
        </div>
      )}
    </header>
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
