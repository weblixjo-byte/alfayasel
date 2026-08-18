import { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'الأسئلة الشائعة | مختبرات الفياصل' : 'FAQs | Al Fayasel Laboratories',
    description: isAr 
      ? 'إجابات على الأسئلة الشائعة حول منتجات مختبرات الفياصل، التوصيل، الدفع، والمزيد.' 
      : 'Answers to frequently asked questions about Al Fayasel Laboratories products, delivery, payment, and more.',
    alternates: {
      canonical: isAr ? 'https://alfayasel.com/ar/faqs' : 'https://alfayasel.com/en/faqs',
      languages: {
        en: 'https://alfayasel.com/en/faqs',
        ar: 'https://alfayasel.com/ar/faqs',
      },
    },
  };
}

export default function FAQsLayout({ children, params }: { children: React.ReactNode, params: { lang: Locale } }) {
  return <>{children}</>;
}
