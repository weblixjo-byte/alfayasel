import { Metadata } from 'next';
import { Locale } from '@/lib/i18n/config';

type Props = { params: { lang: Locale } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'شهاداتنا | مختبرات الفياصل' : 'Our Certificates | Al Fayasel Laboratories',
    description: isAr 
      ? 'اطلع على شهادات التصنيع الجيد (GMP) الخاصة بمختبرات الفياصل الأردنية، والموثقة من الغذاء والدواء.' 
      : 'View the Good Manufacturing Practice (GMP) certificates for Al Fayasel Laboratories, approved by JFDA.',
    alternates: {
      canonical: isAr ? 'https://alfayasel.com/ar/our-certificates' : 'https://alfayasel.com/en/our-certificates',
      languages: {
        en: 'https://alfayasel.com/en/our-certificates',
        ar: 'https://alfayasel.com/ar/our-certificates',
      },
    },
  };
}

export default function CertificatesLayout({ children, params }: { children: React.ReactNode, params: { lang: Locale } }) {
  return <>{children}</>;
}
