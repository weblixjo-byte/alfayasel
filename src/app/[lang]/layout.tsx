import React, { Suspense } from 'react';
import { Locale, locales } from '@/lib/i18n/config';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { StickyHeader } from '@/components/layout/StickyHeader';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { lang: Locale };
}

export default function LocaleLayout({ children, params: { lang } }: LocaleLayoutProps) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={lang === 'ar' ? 'font-arabic' : 'font-sans'}>
      <OrganizationJsonLd />
      <Suspense fallback={null}>
        <StickyHeader locale={lang} />
      </Suspense>
      <TopBar locale={lang} />
      <Suspense fallback={null}>
        <Header locale={lang} />
      </Suspense>
      <Suspense fallback={null}>
        <Navbar locale={lang} />
      </Suspense>

      <main className="min-h-screen">{children}</main>

      <Footer locale={lang} />
      <CartDrawer locale={lang} />
    </div>
  );
}
