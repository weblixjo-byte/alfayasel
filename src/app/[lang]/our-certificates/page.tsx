'use client';

import React from 'react';
import { Locale } from '@/lib/i18n/config';
import { FileText, ExternalLink } from 'lucide-react';

interface CertificatesPageProps {
  params: { lang: Locale };
}

export default function CertificatesPage({ params: { lang } }: CertificatesPageProps) {
  const isAr = lang === 'ar';

  const text = {
    en: {
      pageTitle: 'Our Certificates',
      cert1: 'Good Manufacturing Practice - Cosmetics',
      cert2: 'Good Manufacturing Practice - Medical Devices',
      viewCert: 'View Certificate',
    },
    ar: {
      pageTitle: 'شهاداتنا',
      cert1: 'ممارسة التصنيع الجيد - مستحضرات التجميل',
      cert2: 'ممارسة التصنيع الجيد - الأجهزة الطبية',
      viewCert: 'عرض الشهادة',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  const certificates = [
    {
      href: '/pdf/GMP Certificate for Cosmetics.pdf',
      title: currentText.cert1,
    },
    {
      href: '/pdf/GMP Certificate for medical devices.pdf',
      title: currentText.cert2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white min-h-[50vh]">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-start font-sans">
        {currentText.pageTitle}
      </h1>

      {/* Grid of PDF Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {certificates.map((cert, idx) => (
          <a
            key={idx}
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-8 bg-gray-50 border border-gray-200 rounded-3xl hover:border-[#0066b2] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-[#0066b2]" />
            </div>
            
            <h3 className="font-bold text-gray-900 text-center text-sm md:text-base leading-relaxed">
              {cert.title}
            </h3>
            
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-[#0066b2] uppercase tracking-wider">
              <span>{currentText.viewCert}</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
