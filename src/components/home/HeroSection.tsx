'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ChevronRight, ChevronLeft } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Locale, getDictionary, getLocalizedPath } from '@/lib/i18n/config';
import { INITIAL_CATEGORIES, CategoryData } from '@/lib/data/products';

interface HeroSectionProps {
  locale: Locale;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  const [categoriesList, setCategoriesList] = useState<CategoryData[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          const raw = data.categories;
          const parents = raw.filter((c: any) => !c.parentSlug);
          const subcats = raw.filter((c: any) => c.parentSlug);

          const formatted: CategoryData[] = parents.map((p: any) => ({
            id: p._id,
            name: p.name,
            slug: p.slug,
            description: p.description || { en: '', ar: '' },
            icon: p.icon || 'Package',
            image: p.image || '/images/categories/default.png',
            subcategories: subcats
              .filter((s: any) => s.parentSlug === p.slug)
              .map((s: any) => ({
                id: s._id,
                name: s.name,
                slug: s.slug,
                description: s.description || { en: '', ar: '' },
              })),
          }));
          setCategoriesList(formatted);
        }
      })
      .catch((err) => console.error('Failed to load dynamic categories:', err));
  }, []);
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const isAr = locale === 'ar';

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

  const heroImages = [
    { src: '/images/slider-3.webp', alt: 'Be Well. Be beautiful. Be you.' },
    { src: '/images/slider-2.webp', alt: 'Modern effective formulas.' },
    { src: '/images/slider-1.webp', alt: 'Surely feel better with our products.' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    if (!categoriesOpen) return;
    const handleScroll = () => {
      setCategoriesOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [categoriesOpen]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-0 pb-6">
      {/* Desktop-only Top Navbar Row */}
      <div className="hidden md:flex items-center justify-between border-b border-gray-200 bg-white h-12 select-none">
        {/* Browse Categories Button */}
        <div className="w-64 bg-[#0066b2] text-white font-bold text-xs uppercase px-4 py-3.5 flex items-center justify-between tracking-wider shrink-0 select-none h-full">
          <div className="flex items-center gap-3">
            <Menu className="w-4 h-4" />
            <span>{isAr ? 'تصفح الفئات' : 'BROWSE CATEGORIES'}</span>
          </div>
          <span className="text-xs">▼</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-6 px-6 text-sm font-bold text-gray-800 tracking-wider uppercase flex-1">
          <Link href={getLocalizedPath('/', locale)} className="text-[#0066b2] py-3.5 transition-colors">
            {isAr ? 'الرئيسية' : 'HOME'}
          </Link>
          <Link href={getLocalizedPath('/our-products', locale)} className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors">
            {isAr ? 'منتجاتنا' : 'OUR PRODUCTS'}
          </Link>
          <Link href={getLocalizedPath('/about-us', locale)} className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors">
            {isAr ? 'من نحن' : 'ABOUT US'}
          </Link>
          <Link href={getLocalizedPath('/contact-us', locale)} className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors">
            {isAr ? 'اتصل بنا' : 'CONTACT US'}
          </Link>
          <Link href={getLocalizedPath('/our-certificates', locale)} className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors">
            {isAr ? 'شهاداتنا' : 'OUR CERTIFICATES'}
          </Link>
          <Link
            href={getLanguageSwitcherPath()}
            className="text-gray-800 hover:text-[#0066b2] py-3.5 transition-colors flex items-center gap-1.5"
          >
            {isAr ? (
              <><UsFlag /><span>ENGLISH</span></>
            ) : (
              <><SaFlag /><span>ARABIC</span></>
            )}
          </Link>
        </div>

        {/* Special Offer - Desktop */}
        <div className="pe-4">
          <Link
            href={getLocalizedPath('/shop?offer=special', locale)}
            className="text-sm font-bold text-[#0066b2] hover:text-[#005594] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
            <span>{isAr ? 'عروض خاصة' : 'SPECIAL OFFER'}</span>
          </Link>
        </div>
      </div>

      {/* Hero Layout: Desktop = Side-by-side, Mobile = Slider Only */}
      <div className="flex items-start gap-6 pt-0 relative">
        {/* Left Column: Vertical Category List - Desktop only */}
        <div
          className="hidden md:block w-64 bg-white border-x border-b border-gray-200 shrink-0 relative z-30 shadow-xs max-h-[470px] overflow-y-auto scrollbar-thin"
          onMouseLeave={() => setActiveCategory(null)}
        >
          <ul className="divide-y divide-gray-100 text-xs text-gray-700">
            {categoriesList.map((cat) => {
              const isHovered = activeCategory?.slug === cat.slug;
              return (
                <li
                  key={cat.slug}
                  onMouseEnter={() => setActiveCategory(cat)}
                  className={`group relative flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors ${
                    isHovered ? 'bg-gray-50 text-brand-600 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <Link
                    href={getLocalizedPath(`/shop/${cat.slug}`, locale)}
                    className="flex-1 capitalize font-medium text-gray-700 group-hover:text-brand-600"
                  >
                    {cat.name[locale]}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-600" />
                  {isHovered && cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="absolute start-full top-0 w-64 bg-white border border-gray-200 shadow-xl z-50 p-4 space-y-2 animate-in fade-in slide-in-from-start-2">
                      <div className="space-y-2">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={getLocalizedPath(`/shop/${cat.slug}/${sub.slug}`, locale)}
                            className="block text-xs font-medium text-gray-600 hover:text-brand-600 transition-colors py-1 capitalize"
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

        {/* Right Column: Hero Image Slider */}
        <div className="flex-1 relative h-[240px] sm:h-[340px] md:h-[470px] bg-white border-b border-gray-200 overflow-hidden">
          {heroImages.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0} // Priority load only for first slider image
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          ))}

          {/* Pagination Dots */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full border-2 border-white transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-white scale-110 shadow-md' : 'bg-transparent hover:bg-white/50'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile quick-access categories overlay (placed outside overflow-hidden sibling container) */}
        <div className="md:hidden absolute top-3 start-7 z-30">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="bg-[#0066b2] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-[#005594] transition-colors"
          >
            <Menu className="w-4 h-4" />
            {isAr ? 'الأقسام' : 'CATEGORIES'}
          </button>

          {categoriesOpen && (
            <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl w-52 max-h-72 overflow-y-auto">
              {categoriesList.map((cat) => (
                <Link
                  key={cat.slug}
                  href={getLocalizedPath(`/shop/${cat.slug}`, locale)}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#0066b2] border-b border-gray-100 last:border-0 transition-colors"
                >
                  <span>{cat.name[locale]}</span>
                  {isAr
                    ? <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                    : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  }
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
