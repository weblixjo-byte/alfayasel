import React from 'react';
import { Locale } from '@/lib/i18n/config';

interface PrivacyPolicyPageProps {
  params: { lang: Locale };
}

export const revalidate = 86400; // 24 Hours ISR - Static Edge CDN


import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: 'en' | 'ar' } }): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'سياسة الخصوصية | مختبرات الفيصل' : 'Privacy Policy | Al Fayasel Laboratories',
    description: isAr ? 'سياسة الخصوصية لموقع مختبرات الفيصل توضح كيفية حماية بياناتك ومعلوماتك الشخصية.' : 'Privacy Policy for Al Fayasel Laboratories website.',
    alternates: {
      canonical: params.lang === 'en' ? 'https://alfayasel.com/privacy-policy-3' : 'https://alfayasel.com/ar/privacy-policy-3',
      languages: {
        en: 'https://alfayasel.com/privacy-policy-3',
        ar: 'https://alfayasel.com/ar/privacy-policy-3',
      },
    },
  };
}

export default function PrivacyPolicyPage({ params: { lang } }: PrivacyPolicyPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      pageTitle: 'Privacy Policy',
      subTitle: 'Privacy Policy and Information Confidentiality',
      welcomeText:
        'Al Fayasel Laboratories team welcomes you, and thanks you for your trust. We would like to inform you that out of our keenness and full awareness that the user has rights, we seek to preserve user information in accordance with our Privacy Policy and Information Confidentiality mechanism. Accordingly, we explain to you the Privacy Policy and Information Confidentiality under which your private information will be handled as follows:',
      section1Title: 'First: Information obtained and stored by Al Fayasel Laboratories in its databases',
      section1Bullets: [
        'Personal information of the user, such as username, password, and email address.',
        'The nature of the electronic platform may impose some information related to cookies for electronic purposes that facilitate interaction between the store and the user.',
      ],
      section2Title: 'Second: Does Al Fayasel Laboratories store share this information?',
      section2Bullets: [
        'Naturally, we seek to retain this information in a way that preserves the user\'s privacy, and we only keep this information with the aim of improving the quality of the online store and facilitating the interaction between the store and the user.',
        'As a general rule, all of this information is only viewed by those in charge of the store, and they will not publish it or broadcast it to others.',
        'Since we seek to preserve the safety of users, if we notice any irregular or illegal activity carried out by the user, the store may report it to the competent authorities.',
      ],
      section3Title: 'Third: How secure is the confidentiality of the store\'s private information?',
      section3Bullets: [
        'We seek in Al Fayasel Laboratories store to keep the information and privacy policy of users confidential and will not violate the provisions of these rules and policy. However, since this cannot be 100% guaranteed over the internet, we must clarify the following:',
        'We always strive to preserve all private user information and ensure no one views it in violation of this policy. However, since the internet cannot be 100% guaranteed due to potential breaches or viruses on electronic security systems and firewalls, we advise users to keep their information strictly confidential and not disclose any information they deem highly important to them.',
      ],
    },
    ar: {
      pageTitle: 'سياسة الخصوصية',
      subTitle: 'سياسة الخصوصية وسرية المعلومات',
      welcomeText:
        'يرحب بكم فريق عمل مختبرات الفياصل ، ويتقدّم إليكم بالشكر على ثقتكم به، ونود إعلامكم بأنه حرصاً منا و لإدراكنا التام بأن المستخدم له حقوق، فإننا نسعى للحفاظ على المعلومات الخاصة بالمستخدمين وفقاً لآلية سياسة الخصوصية وسرية المعلومات المعمول بها لدينا . وعليه نوضح لكم سياسة الخصوصية وسرية المعلومات التي سيتم التعامل مع معلوماتكم الخاصة بكم بموجبها كما يلي :',
      section1Title: 'أولاً: المعلومات التي تحصل عليها مختبرات الفياصل وتحتفظ بها في قواعد بياناتها',
      section1Bullets: [
        'معلومات الشخصية الخاصة بالمستخدم مثل اسم المستخدم وكلمة السر والبريد الالكتروني',
        'قد تفرض طبيعة المنصة الالكترونية بعض المعلومات المتعلقة بالكوكيز وذلك لأغراض الكترونية تسهل التعامل بين المتجر والمستخدم',
      ],
      section2Title: 'ثانياً: هل متجر مختبرات الفياصل يشارك هذه المعلومات؟',
      section2Bullets: [
        'بطبيعة الحال نحن نسعى بالاحتفاظ بهذه المعلومات بما يحفظ خصوصية المستخدم، و نحن لا نحتفظ بهذه المعلومات إلا بهدف تحسين جودة المتجر الإلكتروني وتيسير التعامل فيما بين المتجر والمستخدم',
        'كقاعدة عامة فإن جميع هذه المعلومات لا تطلع عليها إلا القائمين على المتجر ، ولن يقوموا بنشرها أو بثها للغير',
        'حيث أننا نسعى للحفاظ على سلامة المستخدمين، فإنه – في حالة ملاحظتنا لأي نشاط غير نظامي أو غير شرعي يقوم به المستخدم – فإن المتجر قد يقوم بإبلاغ الجهات المختصة .',
      ],
      section3Title: 'ثالثاً: ما هو مدى أمان سرية المعلومات الخاصة بالمتجر؟',
      section3Bullets: [
        'نسعى في متجر مختبرات الفياصل إلى سرية المعلومات وسياسة الخصوصية الخاصة بالمستخدمين و لن تخالف أحكام هذه القواعد والسياسة. ولكن نظراً لعدم إمكانية ضمان ذلك 100% عبر وسائل الإنترنت فإنه وجب علينا توضيح التالي :',
        'نسعى دوماً للحفاظ على جميع المعلومات الخاصة بالمستخدم وألا يطلع عليها أحد بما يخالف هذه السياسة المعمول بها في متجرنا غير أنه نظراً لأن شبكة الانترنت لا يمكن ضمانها 100% لما قد يطرأ من اختراق أو فيروسات على أنظمة الحماية الالكترونية و على جدران الحماية المعمول به في متجرنا فإننا ننصح المستخدمين بالحفاظ على معلوماتهم بسرية تامة، وعدم إفشاء أي معلومات يراها المستخدم هامة جداً له.',
      ],
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
        <h2 className="text-lg font-semibold text-[#0066b2]">{currentText.subTitle}</h2>
      </div>

      {/* Welcome Intro */}
      <p className="text-sm leading-relaxed text-gray-600 font-normal">
        {currentText.welcomeText}
      </p>

      {/* Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{currentText.section1Title}</h3>
          <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
            {currentText.section1Bullets.map((bullet, idx) => (
              <li key={idx} className="ps-1">
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{currentText.section2Title}</h3>
          <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
            {currentText.section2Bullets.map((bullet, idx) => (
              <li key={idx} className="ps-1">
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{currentText.section3Title}</h3>
          <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
            {currentText.section3Bullets.map((bullet, idx) => (
              <li key={idx} className="ps-1">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
