'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname() || '';
  const isEnglish = pathname.startsWith('/en');

  // We keep track of mounted state to avoid hydration mismatch if doing client-side language logic
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(0.8); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
        }
        @keyframes floatingFlask {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes liquidWave {
          0% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(-5px); }
        }
        .bubble { 
          position: absolute; 
          background-color: rgba(255,255,255,0.7); 
          border-radius: 50%; 
          animation: floatUp infinite ease-in; 
        }
        .bubble-1 { width: 10px; h-10px; bottom: 30%; left: 35%; animation-duration: 2.5s; animation-delay: 0.1s; }
        .bubble-2 { width: 14px; h-14px; bottom: 20%; left: 50%; animation-duration: 2.1s; animation-delay: 0.8s; }
        .bubble-3 { width: 8px; h-8px; bottom: 40%; left: 65%; animation-duration: 2.8s; animation-delay: 0.4s; }
        .bubble-4 { width: 12px; h-12px; bottom: 25%; left: 40%; animation-duration: 2.3s; animation-delay: 1.2s; }
        
        .flask-animation { animation: floatingFlask 4s infinite ease-in-out; }
        .liquid-animation { animation: liquidWave 3s infinite ease-in-out; }
      `}} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Animated Chemical Flask */}
        <div className="relative w-48 h-48 mb-8 flask-animation flex justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            {/* Flask Glass Body */}
            <path d="M40 15 L40 35 L15 80 A 10 10 0 0 0 25 95 L75 95 A 10 10 0 0 0 85 80 L60 35 L60 15 Z" 
                  fill="rgba(240, 249, 255, 0.8)" 
                  stroke="#0284c7" strokeWidth="3" strokeLinejoin="round" />
            
            {/* Liquid */}
            <path d="M22 65 L78 65 L85 80 A 10 10 0 0 1 75 95 L25 95 A 10 10 0 0 1 15 80 Z" 
                  fill="#0ea5e9" className="liquid-animation opacity-80" />
            
            {/* Flask Neck Highlights */}
            <rect x="37" y="10" width="26" height="5" rx="2" fill="#0284c7" />
            
            {/* Measurement lines */}
            <line x1="28" y1="75" x2="35" y2="75" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
            <line x1="33" y1="60" x2="38" y2="60" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
            <line x1="37" y1="45" x2="40" y2="45" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
          </svg>
          
          {/* Bubbles */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <div className="bubble bubble-1 w-2.5 h-2.5" />
            <div className="bubble bubble-2 w-3.5 h-3.5" />
            <div className="bubble bubble-3 w-2 h-2" />
            <div className="bubble bubble-4 w-3 h-3" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-8xl font-black text-brand-600 tracking-tighter mb-4 drop-shadow-sm">404</h1>
        
        <div className="space-y-4 mb-10" dir={isEnglish ? 'ltr' : 'rtl'}>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isEnglish ? "Formula Not Found!" : "عذراً، التركيبة مفقودة!"}
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {isEnglish 
              ? "It seems the page or formula you are looking for has evaporated or does not exist in our laboratories."
              : "يبدو أن الصفحة أو التركيبة التي تبحث عنها قد تبخرت أو لا وجود لها في مختبراتنا."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-8">
          <Link 
            href={isEnglish ? "/en" : "/ar"}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            {isEnglish ? "Back to Home" : "العودة للرئيسية"}
          </Link>
          
          <Link 
            href={isEnglish ? "/en/shop" : "/ar/shop"}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-brand-500 hover:text-brand-600 text-gray-700 font-bold px-8 py-3.5 rounded-2xl shadow-sm transition-all hover:-translate-y-1"
          >
            <ShoppingBag className="w-5 h-5" />
            {isEnglish ? "Continue Shopping" : "مواصلة التسوق"}
          </Link>
        </div>
      </div>
    </div>
  );
}
