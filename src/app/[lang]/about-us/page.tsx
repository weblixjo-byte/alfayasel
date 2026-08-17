import React from 'react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  ShieldCheck,
  Microscope,
  TrendingUp,
  Target,
  Award,
  Users,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

interface AboutUsPageProps {
  params: { lang: Locale };
}

export async function generateMetadata({ params }: AboutUsPageProps): Promise<Metadata> {
  const isAr = params.lang === 'ar';
  return {
    title: isAr ? 'من نحن | مختبرات الفياصل الدوائية' : 'About Us | Al Fayasel Laboratories',
    description: isAr
      ? 'تعرف على مختبرات الفياصل الدوائية — شركة أردنية رائدة في مجال المستحضرات الطبية والتجميلية منذ عام ١٩٨٩.'
      : 'Learn about Al Fayasel Laboratories — a leading Jordanian company in pharmaceutical and cosmetic products since 1989.',
  };
}

export default function AboutUsPage({ params: { lang } }: AboutUsPageProps) {
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const stats = [
    {
      value: '1989',
      label: isAr ? 'سنة التأسيس' : 'Founded',
      icon: Award,
    },
    {
      value: '35+',
      label: isAr ? 'عاماً من الخبرة' : 'Years of Experience',
      icon: TrendingUp,
    },
    {
      value: '$200M',
      label: isAr ? 'قيمة شراكاتنا' : 'Partnership Value',
      icon: Globe,
    },
    {
      value: 'ISO',
      label: isAr ? 'معتمدون دولياً' : '9001 Certified',
      icon: ShieldCheck,
    },
  ];

  const products = isAr
    ? ['جل التزليق الطبي', 'جل الموجات فوق الصوتية', 'منتجات العناية بالبشرة', 'منتجات العناية بالشعر', 'المطهرات والمعقمات', 'مستحضرات التجميل']
    : ['Lubricant Gels', 'Ultrasound Gel', 'Skin Care Products', 'Hair Care Products', 'Disinfectants & Soaps', 'Cosmetic Products'];

  const qualityPoints = isAr
    ? [
        'تنتج مجموعة متكاملة من المنتجات الكيميائية والطبية والتجميلية بأحجام وأنواع متعددة.',
        'تزود المستشفيات الحكومية والخاصة، الصيدليات والفنادق بمنتجاتها المتميزة.',
        'قادرة على إنتاج منتجات مخصصة للتصدير والسوق المحلي وفق اتفاقيات خاصة.',
        'تلتزم بتقديم منتجات عالية الجودة وخدمات تلبي احتياجات العملاء.',
        'تضمن تحقيق نجاحات مستمرة لمصلحة الشركاء والموردين والموظفين.',
      ]
    : [
        'Produces a wide range of chemical, paramedical and cosmetical products in various sizes.',
        'Supplies public and private hospitals, pharmacies and hotels with premium products.',
        'Capable of producing custom products for export and local market under special agreements.',
        'Committed to providing clients with high quality products and associated services.',
        'Guarantees continuous success meeting the interests of all partners and stakeholders.',
      ];

  const ownerParagraphs = isAr
    ? [
        'اسمي محيي الدين الجوهري، من نابلس - فلسطين. أحمل الجنسية الأردنية وأقيم في عمان. حصلت على بكالوريوس الكيمياء (١٩٦١) من الجامعة الأمريكية في بيروت، وماجستير الهندسة الكيميائية (١٩٦٥) من جامعة ولاية آيوا بالولايات المتحدة الأمريكية.',
        'شغلت مناصب قيادية في كبرى الشركات الأردنية كشركة مناجم الفوسفات الأردنية وشركة البوتاس العربية. في عام ١٩٨٩ أسست مختبرات الفياصل برأس مال متواضع لكن بخلفية علمية وتكنولوجية راسخة.',
        'في ١٩٩٨ تم اختيارنا شركاء ومزودي معرفة لرجال أعمال سعوديين، فأسسنا شركة أفالون للصناعات الدوائية في الرياض، التي تبلغ قيمتها اليوم ٢٠٠ مليون دولار.',
        'حصلنا على شهادة ISO 9001، وشهادة التصنيع الجيد (GMP) لمستحضرات التجميل والمنتجات الدوائية من مؤسسة الغذاء والدواء الأردنية.',
      ]
    : [
        'My name is Muhyiddin Jawhari from Nablus, Palestine. I hold Jordanian citizenship and reside in Amman. I earned my B.Sc in Chemistry (1961) from the American University of Beirut, and M.S. in Chemical Engineering (1965) from Iowa State University, USA.',
        'I held major positions in leading Jordanian companies including JPMC and Arab Potash Company. In 1989, I left employment to establish Al-Fayasel Laboratories — starting with modest capital but an exceptional scientific foundation.',
        'In 1998, we became partners and know-how suppliers to Saudi businessmen, establishing Avalon Pharmaceutical Company in Riyadh, now valued at USD 200 Million.',
        'We earned ISO 9001 certification, and GMP certifications for both cosmetics and pharmaceutical products from the Jordan Food and Drug Administration (JFDA).',
      ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={`bg-white ${isAr ? 'font-arabic' : ''}`}>

      {/* ══════════════════════════════════════════
          HERO — Dark navy with logo
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#0f1923] overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 60px)' }}
        />
        {/* Blue glow */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0066b2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#0066b2]" />
            <span className="text-[#0066b2] text-[11px] font-bold uppercase tracking-[0.2em]">
              {isAr ? 'مختبرات الفياصل الدوائية' : 'Al Fayasel Laboratories'}
            </span>
            <div className="h-px w-12 bg-[#0066b2]" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center leading-tight tracking-tight mb-6">
            {isAr ? (
              <>رائدون في صناعة<br /><span className="text-[#0066b2]">المستحضرات الطبية والتجميلية</span></>
            ) : (
              <>Pioneers in<br /><span className="text-[#0066b2]">Pharmaceutical & Cosmetic Excellence</span></>
            )}
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed text-center max-w-2xl mx-auto mb-10">
            {isAr
              ? 'تأسست عام ١٩٨٩ كواحدة من أولى الشركات الأردنية المتخصصة في إنتاج المستحضرات الطبية المساندة، مستحضرات التجميل، والمنتجات الكيميائية المتطورة.'
              : 'Established in 1989 as one of the first Jordanian companies specializing in paramedical, cosmetical and advanced chemical products manufacturing.'}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href={getLocalizedPath('/contact-us', lang)}
              className="inline-flex items-center gap-2 bg-[#0066b2] hover:bg-[#005594] text-white text-sm font-bold px-6 py-3 transition-all duration-200 hover:gap-3"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
              <Arrow className="w-4 h-4" />
            </Link>
            <Link
              href={getLocalizedPath('/our-products', lang)}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white text-sm font-bold px-6 py-3 transition-all duration-200"
            >
              {isAr ? 'منتجاتنا' : 'Our Products'}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════ */}
      <section className="bg-[#0066b2]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20 rtl:divide-x-reverse">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-8 px-4">
                <Icon className="w-5 h-5 text-white/60" />
                <span className="text-2xl md:text-3xl font-extrabold text-white">{value}</span>
                <span className="text-[11px] text-white/70 font-medium uppercase tracking-wider text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT + PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div className="space-y-6">
              <div>
                <span className="text-[#0066b2] text-[11px] font-bold uppercase tracking-[0.2em]">
                  {isAr ? 'قصتنا' : 'Our Story'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
                  {isAr ? 'من نحن وماذا نصنع' : 'Who We Are & What We Make'}
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isAr
                  ? 'مختبرات الفياصل شركة أردنية تأسست عام ١٩٨٩، وهي من أوائل الشركات في الأردن والوطن العربي في إنتاج المواد الطبية المساندة. تأسست على يد المهندس محيي الدين الجوهري.'
                  : 'Al Fayasel Laboratories is a Jordanian company established in 1989, considered one of the first in Jordan and the Arab World to produce paramedical materials. Founded by Engineer Muhyiddin Jawhari.'}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isAr
                  ? 'حصلنا على ترخيص يمكننا من إنتاج مجموعة واسعة جداً من المنتجات الكيميائية والتجميلية والصيدلانية، ونبيع منتجاتنا داخل الأردن وخارجه.'
                  : 'Licensed to produce a very wide range of chemical, cosmetical and pharmaceutical products, we sell our products in Jordan and internationally.'}
              </p>

              {/* Products grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {products.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-[#0066b2] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="relative">
              <div className="bg-[#0f1923] rounded-2xl p-8 md:p-10 space-y-6">
                <div className="w-12 h-12 bg-[#0066b2]/20 rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-[#0066b2]" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isAr ? 'معتمدون دولياً' : 'Internationally Certified'}
                </h3>
                <div className="space-y-4">
                  {[
                    { cert: 'ISO 9001', desc: isAr ? 'نظام إدارة الجودة' : 'Quality Management System' },
                    { cert: 'GMP Cosmetics', desc: isAr ? 'ممارسات التصنيع الجيدة للتجميل' : 'Good Manufacturing Practices for Cosmetics' },
                    { cert: 'GMP Pharma', desc: isAr ? 'ممارسات التصنيع الجيدة للدواء' : 'Good Manufacturing Practices for Pharmaceuticals' },
                    { cert: 'JFDA', desc: isAr ? 'معتمد من مؤسسة الغذاء والدواء الأردنية' : 'Jordan Food & Drug Administration Approved' },
                  ].map(({ cert, desc }) => (
                    <div key={cert} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#0066b2] rounded-full mt-1.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-bold">{cert}</p>
                        <p className="text-gray-400 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -end-4 w-24 h-24 bg-[#0066b2]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUALITY POLICY — Light gray bg
      ══════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 md:py-28 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#0066b2] text-[11px] font-bold uppercase tracking-[0.2em]">
              {isAr ? 'التزامنا' : 'Our Commitment'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
              {isAr ? 'سياسة الجودة' : 'Quality Policy'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityPoints.map((point, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#0066b2]/20 transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-[#0066b2]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0066b2] transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#0066b2] group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GROWTH + GOALS — Two columns
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Growth */}
            <div className="space-y-5">
              <div className="w-12 h-12 bg-[#0066b2]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#0066b2]" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                {isAr ? 'إستراتيجية النمو' : 'Growth Strategy'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isAr
                  ? 'تعمل مختبرات الفياصل بجد لتطوير وتحسين منتجاتها من خلال اتباع أحدث الإجراءات والتقنيات في التصنيع، وتسعى لاستكشاف طرق تسويقية مبتكرة لجذب المزيد من العملاء.'
                  : 'Al Fayasel Laboratories works hard to develop and improve its products by following up-to-date manufacturing procedures and techniques, while exploring innovative marketing methods to expand its client base.'}
              </p>
            </div>
            {/* Goals */}
            <div className="space-y-5">
              <div className="w-12 h-12 bg-[#0066b2]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#0066b2]" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                {isAr ? 'أهداف العمل' : 'Business Goals'}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isAr
                  ? 'تلتزم مختبرات الفياصل بتزويد عملائها بمنتجات عالية الجودة وخدمات تلبي احتياجاتهم وتضمن نجاحاً مستمراً يخدم الشركاء والموردين والموظفين والمجتمع.'
                  : 'Al Fayasel Laboratories is committed to providing high quality products and services that satisfy client demand, aiming for continuous success that serves partners, suppliers, employees and community.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOUNDER MESSAGE — Dark bg
      ══════════════════════════════════════════ */}
      <section className="bg-[#0f1923] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#0066b2]" />
              <Users className="w-4 h-4 text-[#0066b2]" />
              <div className="h-px w-12 bg-[#0066b2]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {isAr ? 'كلمة المؤسس' : "A Word from Our Founder"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isAr ? 'المهندس محيي الدين الجوهري — المدير العام' : 'Eng. Muhyiddin Jawhari — General Manager'}
            </p>
          </div>

          {/* Quote card */}
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
            {/* Big quote mark */}
            <span className="absolute top-6 start-8 text-[80px] leading-none text-[#0066b2]/20 font-serif select-none">&ldquo;</span>
            <div className="relative space-y-5 pt-6">
              {ownerParagraphs.map((para, i) => (
                <p key={i} className="text-gray-300 text-sm leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Founder badge */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#0066b2] flex items-center justify-center text-white font-bold text-sm shrink-0">
                MJ
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {isAr ? 'م. محيي الدين الجوهري' : 'Eng. Muhyiddin Jawhari'}
                </p>
                <p className="text-gray-400 text-xs">
                  {isAr ? 'مؤسس ومدير عام — مختبرات الفياصل' : 'Founder & General Manager — Al Fayasel Laboratories'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════ */}
      <section className="bg-[#0066b2] py-14">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              {isAr ? 'هل أنت مهتم بمنتجاتنا؟' : 'Interested in our products?'}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {isAr ? 'تواصل معنا اليوم للحصول على مزيد من المعلومات.' : 'Get in touch with us today for more information.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={getLocalizedPath('/contact-us', lang)}
              className="inline-flex items-center gap-2 bg-white text-[#0066b2] font-bold text-sm px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              {isAr ? 'اتصل بنا' : 'Contact Us'}
              <Arrow className="w-4 h-4" />
            </Link>
            <Link
              href={getLocalizedPath('/our-products', lang)}
              className="inline-flex items-center gap-2 border border-white/40 text-white font-bold text-sm px-6 py-3 hover:border-white transition-colors"
            >
              {isAr ? 'منتجاتنا' : 'Our Products'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
