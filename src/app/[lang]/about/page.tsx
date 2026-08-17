import React from 'react';
import Image from 'next/image';
import { Award, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';

interface AboutPageProps {
  params: { lang: Locale };
}

export default function AboutPage({ params: { lang } }: AboutPageProps) {
  const dict = getDictionary(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs text-center space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
          AL FAYASEL LABORATORIES
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {lang === 'ar' ? 'عن مختبرات الفياصل' : 'About Al Fayasel Laboratories'}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {dict.footer.about}
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Pharmaceutical Excellence</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Engineered under rigorous laboratory standards using dermatologically validated formulations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">JFDA Certified</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Registered and compliant with Jordan Food and Drug Administration safety guidelines.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Trusted Since 2017</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Serving thousands of customers in Jordan with effective hair care, skincare, and medical gel solutions.
          </p>
        </div>
      </div>

      {/* Certificates Section */}
      <section id="certificates" className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {dict.nav.ourCertificates}
          </h2>
          <p className="text-xs text-gray-500">
            Our commitment to quality, health, and consumer safety in Jordan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['ISO 9001:2015 Quality Management', 'JFDA Cosmetic & Medical Approval', 'GMP Good Manufacturing Practice'].map((cert, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-brand-500 shrink-0" />
              <span className="font-bold text-xs text-gray-800">{cert}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
