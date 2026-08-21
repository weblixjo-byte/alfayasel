'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQsPageProps {
  params: { lang: Locale };
}


export default function FAQsPage({ params: { lang } }: FAQsPageProps) {
  const isAr = lang === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const text = {
    en: {
      pageTitle: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our products, orders, and delivery.',
      faqs: [
        {
          q: 'Are your products registered with the Ministry of Health?',
          a: 'Yes, all our medical cosmetics and skin care products are fully registered and approved by the Jordanian Ministry of Health (JFDA) and manufactured under Good Manufacturing Practice (GMP) standards.',
        },
        {
          q: 'How much is the delivery fee?',
          a: 'We offer a flat delivery rate of 2 JOD for all orders across Jordan, regardless of the order size or amount.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Orders are typically processed and delivered within 1 to 3 working days depending on your location in Jordan.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'Currently, we accept Cash on Delivery (COD) for all orders. You pay only when you receive your items.',
        },
        {
          q: 'Are your products safe for sensitive skin?',
          a: 'Our products are formulated with high-quality, scientifically proven ingredients. We have specific product lines dedicated to sensitive skin. Please check the individual product usage instructions or consult with your dermatologist.',
        },
      ],
    },
    ar: {
      pageTitle: 'الأسئلة الشائعة',
      subtitle: 'ابحث عن إجابات للأسئلة الشائعة حول منتجاتنا، الطلبات، والتوصيل.',
      faqs: [
        {
          q: 'هل منتجاتكم مسجلة ومصرحة من وزارة الصحة؟',
          a: 'نعم، جميع منتجاتنا الطبية والتجميلية مسجلة بالكامل ومصرحة من قبل المؤسسة العامة للغذاء والدواء الأردنية (JFDA) ويتم تصنيعها وفقاً لمعايير التصنيع الجيد (GMP).',
        },
        {
          q: 'كم تبلغ رسوم التوصيل؟',
          a: 'رسوم التوصيل لدينا هي 2 دينار أردني ثابتة لجميع الطلبات في كافة أنحاء المملكة، بغض النظر عن حجم الطلب أو قيمته.',
        },
        {
          q: 'كم يستغرق توصيل الطلب؟',
          a: 'عادةً ما يتم تجهيز الطلبات وتوصيلها خلال 1 إلى 3 أيام عمل بناءً على موقعك داخل الأردن.',
        },
        {
          q: 'ما هي طرق الدفع المتاحة؟',
          a: 'حالياً، نحن نقبل الدفع نقداً عند الاستلام (Cash on Delivery) لجميع الطلبات. أنت تدفع فقط عند استلام منتجاتك.',
        },
        {
          q: 'هل منتجاتكم آمنة للبشرة الحساسة؟',
          a: 'تم تركيب منتجاتنا باستخدام مكونات عالية الجودة ومثبتة علمياً. لدينا مجموعات منتجات محددة مخصصة للبشرة الحساسة. يرجى التحقق من إرشادات استخدام كل منتج أو استشارة طبيب الجلدية الخاص بك.',
        },
      ],
    },
  };

  const currentText = isAr ? text.ar : text.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-[60vh]">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
          {currentText.pageTitle}
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {currentText.faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-[#0066b2] bg-[#0066b2]/5' : 'border-gray-200 bg-white hover:border-[#0066b2]/50'}`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-start cursor-pointer focus:outline-none"
              >
                <h3 className={`font-bold text-sm md:text-base pe-4 ${isOpen ? 'text-[#0066b2]' : 'text-gray-900'}`}>
                  {faq.q}
                </h3>
                <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'text-[#0066b2]' : 'text-gray-400'}`}>
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
