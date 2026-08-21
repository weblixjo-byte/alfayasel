import React from 'react';
import { Locale } from '@/lib/i18n/config';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Phone, Mail, Printer, Building2, PhoneCall } from 'lucide-react';

interface ContactUsPageProps {
  params: { lang: Locale };
}


import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: 'en' | 'ar' } }): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'اتصل بنا | مختبرات الفيصل' : 'Contact Us | Al Fayasel Laboratories',
    description: isAr ? 'تواصل معنا لأي استفسار حول منتجات مختبرات الفيصل. نحن هنا لخدمتك.' : 'Contact Al Fayasel Laboratories for any inquiries about our products.',
    alternates: {
      canonical: params.lang === 'en' ? 'https://alfayasel.com/contact-us' : 'https://alfayasel.com/ar/contact-us',
      languages: {
        en: 'https://alfayasel.com/contact-us',
        ar: 'https://alfayasel.com/ar/contact-us',
      },
    },
  };
}

export default function ContactUsPage({ params: { lang } }: ContactUsPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      ourAddress: 'OUR ADDRESS',
      ammanJordan: 'Amman, Jordan',
      addressDetails: 'Complex No 3, Ibn Mada St 3,\n7th Circle, Amman, Jordan',
      phone: 'Mobile: 00962776755550',
      telephone: 'Telephone: 009625810818',
      fax: 'Fax: 0096265829837',
      email: 'Email: orders@alfayasel.com',
    },
    ar: {
      ourAddress: 'عنوان الشركة والمختبرات',
      ammanJordan: 'عمان، الأردن',
      addressDetails: 'مجمع رقم 3، شارع ابن مضاء 3،\nالدوار السابع، عمان، الأردن',
      phone: 'الموبايل: 00962776755550',
      telephone: 'الهاتف الأرضي: 009625810818',
      fax: 'الفاكس: 0096265829837',
      email: 'البريد: orders@alfayasel.com',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  // Google Maps iframe pointing to Al Fayasel Laboratories location near 7th Circle Amman
  const mapIframeUrl =
    'https://maps.google.com/maps?q=%D9%85%D8%AE%D8%AA%D8%A8%D8%B1%D8%A7%D8%AA%D9%85%D8%A7%D9%84%D9%81%D9%8A%D8%A7%D8%B5%D9%84,%20Amman,%20Jordan&t=&z=16&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Address and Interactive Form (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Section: OUR ADDRESS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0066b2]" />
              <span>{currentText.ourAddress}</span>
            </h2>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700 leading-relaxed font-normal bg-gray-50/60 border border-gray-100 rounded-2xl p-5">
                {/* Left block: Address Details */}
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0066b2] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">{currentText.ammanJordan}</h3>
                      <p className="whitespace-pre-line text-gray-500 mt-1">
                        {currentText.addressDetails}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right block: Tel, Fax, Email */}
                <div className="space-y-2.5 sm:ps-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#0066b2] shrink-0" />
                    <span className="font-bold text-gray-900">{currentText.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">{currentText.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">{currentText.fax}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0066b2] shrink-0" />
                    <a
                      href="mailto:orders@alfayasel.com"
                      className="text-[#0066b2] hover:underline font-bold"
                    >
                      {currentText.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: CONTACT FORM (Interactive Web3Forms) */}
          <ContactForm lang={lang} />
        </div>

        {/* Right Column: Google Maps Iframe (5 cols) */}
        <div className="lg:col-span-5 w-full h-[450px] lg:h-[620px] bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-sm relative sticky top-28">
          <iframe
            src={mapIframeUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Al Fayasel Laboratories Map Location"
            className="absolute inset-0"
          />
        </div>
      </div>
    </div>
  );
}
