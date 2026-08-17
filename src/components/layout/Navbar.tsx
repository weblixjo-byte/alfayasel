'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';
import { INITIAL_CATEGORIES } from '@/lib/data/products';

interface NavbarProps {
  locale: Locale;
}

export const Navbar: React.FC<NavbarProps> = ({ locale }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAr = locale === 'ar';
  const homePath = getLocalizedPath('/', locale);
  const isHomePage = pathname === homePath || pathname === `${homePath}/`;

  // Hide standalone Navbar on home page because HeroSection contains the exact Woodmart header nav bar
  if (isHomePage) {
    return null;
  }

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

  const isActive = (path: string) => {
    const localizedPath = getLocalizedPath(path, locale);
    if (path === '/') {
      return pathname === localizedPath || pathname === `${localizedPath}/`;
    }
    return pathname.startsWith(localizedPath);
  };

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200 select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        <div className="flex items-center gap-6 h-full">
          {/* Browse Categories dropdown (pure CSS hover driven) */}
          <div className="relative group shrink-0 h-full flex items-center">
            <div className="w-64 bg-[#0066b2] text-white font-bold text-xs uppercase px-4 py-3.5 flex items-center justify-between tracking-wider cursor-pointer h-full">
              <div className="flex items-center gap-3">
                <Menu className="w-4 h-4" />
                <span>{isAr ? 'تصفح الفئات' : 'BROWSE CATEGORIES'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {/* Hover Menu with nested subcategories */}
            <div className="absolute top-full start-0 w-64 bg-white border border-gray-200 shadow-lg hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <ul className="divide-y divide-gray-100 text-xs text-gray-700">
                {INITIAL_CATEGORIES.map((cat) => {
                  const hasSub = cat.subcategories && cat.subcategories.length > 0;
                  return (
                    <li
                      key={cat.slug}
                      className="group/sub relative hover:bg-gray-50 px-4 py-3.5 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <Link
                        href={getLocalizedPath(`/shop?category=${cat.slug}`, locale)}
                        className="flex-1 font-semibold text-gray-700 hover:text-[#0066b2] transition-colors capitalize"
                      >
                        {cat.name[locale]}
                      </Link>
                      {hasSub && (
                        <ChevronRight className={`w-3.5 h-3.5 text-gray-400 group-hover/sub:text-[#0066b2] ${isAr ? 'rotate-180' : ''}`} />
                      )}

                      {/* Sub-menu on Hover */}
                      {hasSub && (
                        <div className="absolute start-full top-0 w-64 bg-white border border-gray-200 shadow-xl hidden group-hover/sub:block z-50 p-4 space-y-2 animate-in fade-in slide-in-from-start-2">
                          <div className="space-y-2">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={getLocalizedPath(`/shop?category=${cat.slug}&sub=${sub.slug}`, locale)}
                                className="block text-xs font-medium text-gray-600 hover:text-[#0066b2] transition-colors py-1 capitalize"
                              >
                                {sub.name[locale]}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 px-4 text-sm font-bold uppercase tracking-wider text-gray-800">
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
        </div>

        {/* Special Offer Link (right side in LTR / left side in RTL) */}
        <div className="pe-4 hidden lg:block">
          <Link
            href={getLocalizedPath('/shop?offer=special', locale)}
            className="text-sm font-bold text-[#0066b2] hover:text-[#005594] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
            <span>{isAr ? 'عروض خاصة' : 'SPECIAL OFFER'}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
