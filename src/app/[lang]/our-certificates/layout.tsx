import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: 'en' | 'ar' } }): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'شهاداتنا | مختبرات الفيصل' : 'Our Certificates | Al Fayasel Laboratories',
    description: isAr ? 'اطلع على شهادات الجودة والاعتمادات التي حصلت عليها مختبرات الفيصل محلياً ودولياً.' : 'View Al Fayasel Laboratories quality certificates and accreditations.',
    alternates: {
      canonical: params.lang === 'en' ? 'https://alfayasel.com/our-certificates' : 'https://alfayasel.com/ar/our-certificates',
      languages: {
        en: 'https://alfayasel.com/our-certificates',
        ar: 'https://alfayasel.com/ar/our-certificates',
      },
    },
  };
}


export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
