'use client';

import React from 'react';
import Image from 'next/image';

export const FloatingWhatsApp = () => {
  const phoneNumber = '962776755550';
  const message = 'Hello Al Fayasel Laboratories, I have an inquiry about...';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/whatsapp.png" 
          alt="WhatsApp" 
          width={56} 
          height={56} 
          className="object-contain"
        />
      </div>
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
        تحدث معنا الآن
      </span>
      {/* Ping animation effect */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
    </a>
  );
};
