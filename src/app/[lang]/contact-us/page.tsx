import React from 'react';
import { Locale } from '@/lib/i18n/config';

interface ContactUsPageProps {
  params: { lang: Locale };
}

export default function ContactUsPage({ params: { lang } }: ContactUsPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      ourAddress: 'OUR ADDRESS',
      ammanJordan: 'Amman , Jordan',
      addressDetails: 'Complex No 3, Ibn Mada St 3,\n7th Circle\nAmman, Jordan',
      phone: 'Phone: : 00962776755550',
      telephone: 'Telephone : 009625810818',
      fax: 'Fax : 0096265829837',
      email: 'Email:orders@alfayasel.com',
      contactUs: 'CONTACT US',
      description: 'Whether you’re looking for answers, would like to solve a problem, or just want to let us know how we did, you’ll find.',
      nameLabel: 'Your Name',
      emailLabel: 'Your Email',
      messageLabel: 'Your Message',
      sendBtn: 'Send Message',
    },
    ar: {
      ourAddress: 'عنواننا',
      ammanJordan: 'عمان، الأردن',
      addressDetails: 'مجمع رقم 3، شارع ابن مضاء 3،\nالدوار السابع\nعمان، الأردن',
      phone: 'الهاتف: 00962776755550',
      telephone: 'الهاتف الأرضي: 009625810818',
      fax: 'الفاكس: 0096265829837',
      email: 'البريد الإلكتروني: orders@alfayasel.com',
      contactUs: 'اتصل بنا',
      description: 'سواء كنت تبحث عن إجابات، أو ترغب في حل مشكلة، أو تريد فقط إخبارنا برأيك، فستجدنا دائماً في خدمتك.',
      nameLabel: 'الاسم الكامل',
      emailLabel: 'البريد الإلكتروني',
      messageLabel: 'رسالتك أو استفسارك',
      sendBtn: 'إرسال الرسالة',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  // Google Maps iframe pointing to Al Fayasel Laboratories location near 7th Circle Amman
  const mapIframeUrl = "https://maps.google.com/maps?q=%D9%85%D8%AE%D8%AA%D8%A8%D8%B1%D8%A7%D8%AA%D9%85%D8%A7%D9%84%D9%81%D9%8A%D8%A7%D8%B5%D9%84,%20Amman,%20Jordan&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Address and Form */}
        <div className="space-y-8">
          {/* Section: OUR ADDRESS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">
              {currentText.ourAddress}
            </h2>
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 leading-relaxed font-normal">
                {/* Left block: Address Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">{currentText.ammanJordan}</h3>
                  <p className="whitespace-pre-line text-gray-500">
                    {currentText.addressDetails}
                  </p>
                  <p className="font-bold text-gray-900 pt-2">{currentText.phone}</p>
                </div>
                {/* Right block: Tel, Fax, Email */}
                <div className="space-y-3 md:ps-4">
                  <p><span className="font-medium text-gray-900">{currentText.telephone}</span></p>
                  <p><span className="font-medium text-gray-900">{currentText.fax}</span></p>
                  <p><span className="font-medium text-gray-900">{currentText.email}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: CONTACT FORM */}
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-bold text-gray-900 tracking-wide">
              {currentText.contactUs}
            </h2>
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                {currentText.description}
              </p>

              <form className="space-y-4 max-w-lg pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 block">{currentText.nameLabel}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-brand-500 focus:outline-none text-xs rounded-xl shadow-xs transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 block">{currentText.emailLabel}</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-brand-500 focus:outline-none text-xs rounded-xl shadow-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">{currentText.messageLabel}</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-brand-500 focus:outline-none text-xs rounded-xl shadow-xs transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg"
                >
                  {currentText.sendBtn}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Iframe */}
        <div className="w-full h-[450px] lg:h-[550px] bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-sm relative">
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
