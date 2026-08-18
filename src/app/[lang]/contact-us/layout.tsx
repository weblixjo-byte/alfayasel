import { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'تواصل معنا | مختبرات الفياصل' : 'Contact Us | Al Fayasel Laboratories',
    description: isAr 
      ? 'تواصل مع مختبرات الفياصل للاستفسارات، الطلبات، ودعم العملاء. نحن هنا لخدمتك.' 
      : 'Contact Al Fayasel Laboratories for inquiries, orders, and customer support. We are here to help.',
    alternates: {
      canonical: isAr ? 'https://alfayasel.com/ar/contact-us' : 'https://alfayasel.com/en/contact-us',
      languages: {
        en: 'https://alfayasel.com/en/contact-us',
        ar: 'https://alfayasel.com/ar/contact-us',
      },
    },
  };
}

export default function ContactUsLayout({ children, params }: { children: React.ReactNode, params: { lang: Locale } }) {
  return <>{children}</>;
}
