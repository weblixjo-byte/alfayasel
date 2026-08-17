'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/i18n/config';
import { X } from 'lucide-react';

interface CertificatesPageProps {
  params: { lang: Locale };
}

export default function CertificatesPage({ params: { lang } }: CertificatesPageProps) {
  const isAr = lang === 'ar';
  const [activeCert, setActiveCert] = useState<{ src: string; title: string } | null>(null);

  const text = {
    en: {
      pageTitle: 'Our Certificates',
      cert1: 'Good Manufacturing Practice - Cosmetics',
      cert2: 'Good Manufacturing Practice - Medical Devices',
      cert3: 'ISO 9001:2008',
      close: 'Close',
    },
    ar: {
      pageTitle: 'شهاداتنا',
      cert1: 'ممارسة التصنيع الجيد - مستحضرات التجميل',
      cert2: 'ممارسة التصنيع الجيد - الأجهزة الطبية',
      cert3: 'آيزو 9001:2008',
      close: 'إغلاق',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  const certificates = [
    {
      src: '/images/cer1-743x1024.jpg',
      title: currentText.cert1,
    },
    {
      src: '/images/cer2-743x1024.jpg',
      title: currentText.cert2,
    },
    {
      src: '/images/cer3-744x1024.jpg',
      title: currentText.cert3,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-start font-sans">
        {currentText.pageTitle}
      </h1>

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {certificates.map((cert, idx) => (
          <div key={idx} className="space-y-4">
            {/* Certificate Label */}
            <h3 className="font-semibold text-xs text-gray-800 text-start leading-relaxed font-sans">
              {cert.title}
            </h3>

            {/* Certificate Image */}
            <div 
              onClick={() => setActiveCert(cert)}
              className="cursor-zoom-in"
            >
              <Image
                src={cert.src}
                alt={cert.title}
                width={400}
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox / Modal */}
      {activeCert && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-xs md:text-sm text-gray-800">
                {activeCert.title}
              </h3>
              <button
                onClick={() => setActiveCert(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                title={currentText.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image container */}
            <div className="relative w-full max-h-[70vh] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-2">
              <Image
                src={activeCert.src}
                alt={activeCert.title}
                width={800}
                height={1000}
                className="w-full max-h-[68vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
