import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: 'en' | 'ar' } }): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'الأسئلة الشائعة | مختبرات الفيصل' : 'FAQs | Al Fayasel Laboratories',
    description: isAr ? 'الأسئلة الشائعة حول منتجات مختبرات الفيصل والشحن والتوصيل.' : 'Frequently Asked Questions about Al Fayasel Laboratories products and shipping.',
    alternates: {
      canonical: params.lang === 'en' ? 'https://alfayasel.com/faqs' : 'https://alfayasel.com/ar/faqs',
      languages: {
        en: 'https://alfayasel.com/faqs',
        ar: 'https://alfayasel.com/ar/faqs',
      },
    },
  };
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
