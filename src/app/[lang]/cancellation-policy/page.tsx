import React from 'react';
import { Locale } from '@/lib/i18n/config';

interface CancellationPolicyPageProps {
  params: { lang: Locale };
}

export default function CancellationPolicyPage({ params: { lang } }: CancellationPolicyPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      pageTitle: 'Cancellation Policy',
      welcomeText: 'If you have to cancel an order, please do so within 24 hours of placing the order.',
      contactIntro: 'You can submit a product cancellation request via our email:',
      email: 'orders@alfayasel.com',
      socialsText: 'Or through our official social media pages.',
      whatsappText: 'Or via WhatsApp at: 00962776755550',
      rulePrepaidBeforeShip: 'If the payment was prepaid and the cancellation occurs before shipping the product, the amount will be fully refunded to you.',
      rulePrepaidAfterShip: 'If the payment was prepaid and the cancellation occurs after shipping the product, 25% of the order value will be deducted.',
    },
    ar: {
      pageTitle: 'سياسة الغاء الطلب',
      welcomeText: 'إذا اضطررت إلى إلغاء أحد الطلبات ، فيرجى القيام بذلك في غضون 24 ساعة من تقديم الطلب.',
      contactIntro: 'يمكنك تقديم طلب الغاء المنتج عن طريق بريدنا الالكتروني',
      email: 'orders@alfayasel.com',
      socialsText: 'او عن طريق صفحاتنا الخاصة عبر وسائل التواصل الاجتماعي',
      whatsappText: 'او عن طريق الوتساب 00962776755550',
      rulePrepaidBeforeShip: 'اذا كان الدفع مسبق و الالغاء قبل شحن المنتج سوف يتم رد المبلغ اليك بالكامل',
      rulePrepaidAfterShip: 'اذا كان الدفع مسبق و الالغاء تم بعد شحن المنتج يتم خصم 25% من قيمة الطلب',
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

      {/* Main content block */}
      <div className="space-y-6 text-sm leading-relaxed text-gray-600 font-normal">
        <p className="text-gray-900 font-semibold">{currentText.welcomeText}</p>

        {/* Contact list */}
        <div className="space-y-2 pt-2">
          <p>{currentText.contactIntro}</p>
          <p className="font-bold text-[#0066b2]">{currentText.email}</p>
          <p>{currentText.socialsText}</p>
          <p>{currentText.whatsappText}</p>
        </div>

        {/* Refund Rules */}
        <div className="space-y-3 pt-6 border-t border-gray-100">
          <p className="text-gray-800 font-medium">{currentText.rulePrepaidBeforeShip}</p>
          <p className="text-gray-800 font-medium">{currentText.rulePrepaidAfterShip}</p>
        </div>
      </div>
    </div>
  );
}
