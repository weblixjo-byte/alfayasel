import React from 'react';
import { Locale } from '@/lib/i18n/config';

interface TermsPageProps {
  params: { lang: Locale };
}

export const revalidate = 86400; // 24 Hours ISR - Static Edge CDN


import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: 'en' | 'ar' } }): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'الشروط والأحكام | مختبرات الفيصل' : 'Terms & Conditions | Al Fayasel Laboratories',
    description: isAr ? 'الشروط والأحكام الخاصة باستخدام موقع مختبرات الفيصل وشراء المنتجات.' : 'Terms and Conditions for using Al Fayasel Laboratories website and purchasing products.',
    alternates: {
      canonical: params.lang === 'en' ? 'https://alfayasel.com/terms-and-conditions' : 'https://alfayasel.com/ar/terms-and-conditions',
      languages: {
        en: 'https://alfayasel.com/terms-and-conditions',
        ar: 'https://alfayasel.com/ar/terms-and-conditions',
      },
    },
  };
}

export default function TermsPage({ params: { lang } }: TermsPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      pageTitle: 'Terms & Conditions',
      contactTitle: 'Contact Us:',
      contactIntro: 'You can contact us via the following numbers:',
      mobile: 'Mobile: 00962776755550',
      phone: 'Phone: 0096265810818',
      fax: 'Fax: 0096265829837',
      socialsText: 'Or through our official social media pages.',
      registerTitle: 'Subscription and Registration:',
      registerRule1: 'The customer is allowed to register only one account, and we reserve the right to suspend any multiple accounts for a single customer.',
      registerRule2: 'We reserve the right to verify the customer\'s identity through any communication channel.',
      shippingTitle: 'Shipping Rates and Delivery Times:',
      shippingRule1: 'Enjoy free shipping by shopping at Al Fayasel Laboratories store.',
      shippingRule2: 'Purchases are delivered within 24 hours in the capital, Amman, and within 48 hours to areas outside Amman.',
      forceMajeureTitle: 'Circumstances Beyond Our Control:',
      forceMajeureText: 'Al Fayasel Laboratories is not responsible for any loss or damage to purchases due to circumstances beyond our control. These include only natural conditions such as earthquakes, hurricanes, storms, floods, and fog, as well as fires, aircraft accidents, power outages, transport routes, or any other disruption.',
    },
    ar: {
      pageTitle: 'الشروط والاحكام',
      contactTitle: 'اتصل بنا:',
      contactIntro: 'يمكنك الاتصال بنا عبر الارقام الاتية:',
      mobile: 'موبايل 00962776755550',
      phone: 'هاتف 0096265810818',
      fax: 'فاكس 0096265829837',
      socialsText: 'او عن طريق صفحاتنا الخاصة عبر وسائل التواصل الاجتماعي',
      registerTitle: 'الاشتراك والتسجيل:',
      registerRule1: 'يُسمح للعميل بتسجيل حساب واحد فقط ويحق لنا إيقاف أي حسابات متعددة لعميل واحد.',
      registerRule2: 'يحق لنا التحقق من هوية العميل من خلال أي قناة اتصال.',
      shippingTitle: 'أسعار الشحن ومواعيد التسليم:',
      shippingRule1: 'تمتع بميزة الشحن المجاني من خلال التسوق عبر متجر مختبرات الفياصل',
      shippingRule2: 'يتم تسليم المشتريات خلال 24 ساعة في العاصمة عمان وخلال 48 ساعة للمناطق خارج عمان.',
      forceMajeureTitle: 'ظروف خارجة عن إرادتنا:',
      forceMajeureText: 'مختبرات الفياصل ليست مسؤولة عن خسارة أو تلف المشتريات بسبب ظروف خارجة عن إرادتنا. تشمل هذه الظروف الطبيعية فقط مثل الزلازل والأعاصير والعواصف والفيضانات والضباب ، وكذلك الحرائق وحوادث الطائرات وانقطاع التيار الكهربائي وطرق النقل أو أي اضطراب آخر.',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`max-w-4xl mx-auto px-6 py-16 bg-white space-y-10 text-gray-800 ${
        isAr ? 'font-arabic text-right' : 'font-sans text-left'
      }`}
    >
      {/* Header section */}
      <div className="space-y-2 border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentText.pageTitle}</h1>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Contact Us Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.contactTitle}</h3>
          <p className="text-gray-600 font-normal">{currentText.contactIntro}</p>
          <ul className="space-y-1 text-gray-600 font-normal">
            <li>{currentText.mobile}</li>
            <li>{currentText.phone}</li>
            <li>{currentText.fax}</li>
            <li className="pt-1">{currentText.socialsText}</li>
          </ul>
        </div>

        {/* Subscription & Registration Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.registerTitle}</h3>
          <ul className="list-disc ps-5 space-y-2 text-gray-600 font-normal">
            <li className="ps-1">{currentText.registerRule1}</li>
            <li className="ps-1">{currentText.registerRule2}</li>
          </ul>
        </div>

        {/* Shipping Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.shippingTitle}</h3>
          <ul className="list-disc ps-5 space-y-2 text-gray-600 font-normal">
            <li className="ps-1">{currentText.shippingRule1}</li>
            <li className="ps-1">{currentText.shippingRule2}</li>
          </ul>
        </div>

        {/* Force Majeure Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.forceMajeureTitle}</h3>
          <p className="text-gray-600 font-normal leading-relaxed">{currentText.forceMajeureText}</p>
        </div>
      </div>
    </div>
  );
}
