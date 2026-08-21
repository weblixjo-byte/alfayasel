'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/i18n/config';

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
    },
    ar: {
      pageTitle: 'شهاداتنا',
      cert1: 'ممارسة التصنيع الجيد - مستحضرات التجميل',
      cert2: 'ممارسة التصنيع الجيد - الأجهزة الطبية',
    },
  };

  const currentText = isAr ? text.ar : text.en;

  const certificates = [
    {
      imgSrc: '/images/cer1-743x1024.jpg',
      pdfHref: '/pdf/GMP Certificate for Cosmetics.pdf',
      title: currentText.cert1,
    },
    {
      imgSrc: '/images/cer2-743x1024.jpg',
      pdfHref: '/pdf/GMP Certificate for medical devices.pdf',
      title: currentText.cert2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white min-h-[50vh]">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-start font-sans">
        {currentText.pageTitle}
      </h1>

      {/* Grid of PDF Certificates with Image Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto md:mx-0">
        {certificates.map((cert, idx) => (
          <a
            key={idx}
            href={cert.pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden hover:border-[#0066b2] hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Certificate Image Thumbnail */}
            <div className="w-full relative bg-white border-b border-gray-100 overflow-hidden">
              <Image
                src={cert.imgSrc}
                alt={cert.title}
                width={500}
                height={700}
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-300"
              />
              
              {/* Overlay for Visual Feedback */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                 <div className="bg-white/90 text-[#0066b2] font-bold text-xs uppercase px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm translate-y-2 group-hover:translate-y-0">
                    {isAr ? 'اضغط لفتح الـ PDF' : 'Click to open PDF'}
                 </div>
              </div>
            </div>
            
            <div className="p-6 w-full">
              <h3 className="font-bold text-gray-900 text-center text-sm md:text-base leading-relaxed group-hover:text-[#0066b2] transition-colors">
                {cert.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
