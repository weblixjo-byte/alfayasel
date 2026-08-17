import React from 'react';
import { Locale } from '@/lib/i18n/config';

interface ReturnPolicyPageProps {
  params: { lang: Locale };
}

export default function ReturnPolicyPage({ params: { lang } }: ReturnPolicyPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      pageTitle: 'Return Policy',
      subTitle: 'Enjoy shopping with the features of our Return Policy',
      introText: 'You have three days from the date of receiving any item to submit a return request. Returns are subject to the following:',
      introBullets: [
        'If you received a product damaged during shipping, please contact our customer service center or contact us via our social media pages within 24 hours.',
        'The product will be inspected. If it is clear to us that the product is unused, the value of the product will be refunded to you in the appropriate manner.',
        'We will respond to you within 24 hours of receiving the product.',
      ],
      notPossibleTitle: 'When is a return not possible:',
      notPossibleBullets: [
        'If the product is consumed, damaged, or not in the same condition you received it.',
        'If the product was exposed to factors that spoiled it (such as sunlight, poor storage conditions... etc.).',
        'If the return is requested outside the specified time frame of three days.',
      ],
      refundTitle: 'Refunded Amounts',
      refundText: 'We will notify you once we have received and inspected your returned product, and let you know if the refund was approved or not. If approved, your money will be automatically refunded using the appropriate payment method. Please remember that it may take some time to process and send the refund as well.',
      requirementsTitle: 'Return Process Requirements',
      requirementsBullets: [
        'Proof of purchase (order number, invoice, etc.).',
        'If we find during the inspection process that the returned product is free of the reason stated in your request or has been used, the value will not be refunded and the product will be returned to you.',
      ],
      howToTitle: 'How is the product returned?',
      howToText: 'The product must be returned with all its accessories and any free gifts attached to it, and in the same condition it reached you.',
      feesTitle: 'Who pays the return shipping fees?',
      feesText: 'The customer bears the cost of return shipping, unless the product is defective, in which case Al Fayasel Laboratories store will bear the return shipping cost.',
      contactTitle: 'You can submit a return request via our email:',
      email: 'orders@alfayasel.com',
      socialsText: 'Or through our official social media pages',
      whatsappText: 'Or via WhatsApp at the following number:',
      whatsappNum: '00962776755550',
    },
    ar: {
      pageTitle: 'سياسة الارجاع',
      subTitle: 'استمتع بالتسوق مع ميزات سياسة الارجاع',
      introText: 'لديك ثلاث أيام من تاريخ إستلامك أي سلعة لتقدم طلب ارجاعها و يكون الاسترجاع وفق التالي :',
      introBullets: [
        'اذا استلمت منتج تعرض للتلف اثناء الشحن فيرجى التواصل مع مركز خدمة العملاء او التواصل عبر صفحات التواصل الاجتماعي الخاصة بنا في غضون 24 ساعة',
        'سوف يتم فحص المنتج اذا توضح لدينا ان المنتج غير مستخدم فسيتم اعادة قيمة المنتج اليك بالطريقة المناسبة',
        'سوف يتم الرد عليك خلال 24 ساعة من استلامنا للمنتج',
      ],
      notPossibleTitle: 'متى يكون الارجاع غير ممكن:',
      notPossibleBullets: [
        'إذا كان المنتج مستهلك، تالف أو ليس في نفس الحالة التي تلقيته عليها',
        'اذا كان المنتج تعرض لعوامل افسدته (مثل اشعة الشمس ، ظروف تخزين سيئة...الخ )',
        'إن تم طلب الإرجاع خارج الإطار الزمني المحدد وهو ثلاث ايام',
      ],
      refundTitle: 'المبالغ المعادة',
      refundText: 'سنقوم بإعلامك بمجرد استلامنا وفحصنا للمنتج المعاد ، سنخبرك إذا تمت الموافقة على رد الأموال أم لا، في حالة الموافقة، سيتم استرداد أموالك تلقائياً باستخدام طريقة الدفع المناسبة. يرجى تذكر أن الأمر قد يستغرق بعض الوقت حتى تتمكن من معالجة رد الأموال وإرسالها أيضاً.',
      requirementsTitle: 'متطلبات عملية الإرجاع',
      requirementsBullets: [
        'إثبات الشراء (رقم الطلب ، الفاتورة ، إلخ.)',
        'إذا وجدنا أثناء عملية الفحص أن المنتج المسترجع خالي من السبب المذكور في طلبك أو استخدامه ، فلن يتم استرداد القيمة وسيتم إرجاع المنتج إليك.',
      ],
      howToTitle: 'كيف يتم إرجاع المنتج؟',
      howToText: 'تكون اعادة المنتج مع كامل ملحقاته و الهدايا المجانية المرفقة معه و في نفس الحالة التي وصلك عليها',
      feesTitle: 'من يدفع رسوم شحن الارجاع ؟',
      feesText: 'يتحمل العميل تكلفة الارجاع الا اذا كان المنتج غير سليم يتحمل متجر مختبرات الفياصل تكلفة شحن الارجاع',
      contactTitle: 'يمكنك تقديم طلب الارجاع عن طريق بريدنا الالكتروني',
      email: 'orders@alfayasel.com',
      socialsText: 'او عن طريق صفحاتنا الخاصة عبر وسائل التواصل الاجتماعي',
      whatsappText: 'او من خلال الوتساب عبر الرقم التالي',
      whatsappNum: '00962776755550',
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

      {/* Intro Text */}
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-gray-600 font-normal">{currentText.introText}</p>
        <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
          {currentText.introBullets.map((bullet, idx) => (
            <li key={idx} className="ps-1">
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-sm leading-relaxed">
        {/* Not Possible Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{currentText.notPossibleTitle}</h3>
          <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
            {currentText.notPossibleBullets.map((bullet, idx) => (
              <li key={idx} className="ps-1">
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.refundTitle}</h3>
          <p className="text-gray-600 font-normal leading-relaxed">{currentText.refundText}</p>
        </div>

        {/* Requirements Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-base">{currentText.requirementsTitle}</h3>
          <ul className="list-disc ps-5 space-y-2.5 text-gray-600 font-normal">
            {currentText.requirementsBullets.map((bullet, idx) => (
              <li key={idx} className="ps-1">
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* How To Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.howToTitle}</h3>
          <p className="text-gray-600 font-normal leading-relaxed">{currentText.howToText}</p>
        </div>

        {/* Fees Section */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-base">{currentText.feesTitle}</h3>
          <p className="text-gray-600 font-normal leading-relaxed">{currentText.feesText}</p>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <p className="font-bold text-gray-900">{currentText.contactTitle}</p>
          <p className="font-bold text-[#0066b2]">{currentText.email}</p>
          <p className="text-gray-600 font-normal">{currentText.socialsText}</p>
          <p className="text-gray-600 font-normal mt-2">{currentText.whatsappText}</p>
          <p className="font-bold text-[#0066b2]">{currentText.whatsappNum}</p>
        </div>
      </div>
    </div>
  );
}
