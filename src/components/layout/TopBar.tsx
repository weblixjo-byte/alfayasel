'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Mail } from 'lucide-react';
import { Locale, getLocalizedPath } from '@/lib/i18n/config';

interface TopBarProps {
  locale: Locale;
}

export const TopBar: React.FC<TopBarProps> = ({ locale }) => {
  const isAr = locale === 'ar';

  return (
    <div className="bg-[#0066b2] text-white text-[11px] font-semibold tracking-wide h-9 flex items-center select-none overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 flex items-center justify-between">
        {/* Welcome text - hide on very small screens */}
        <div className="text-white/95 hidden sm:block">
          <span>{isAr ? 'اهلا بك في الفياصل' : 'Welcome to alfayasel'}</span>
        </div>

        {/* Right side: socials + links */}
        <div className="flex items-center h-9 ms-auto">
          {/* Social Icons */}
          <div className="flex items-center gap-3 px-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://wa.me/962776755550"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </a>
          </div>

          {/* Newsletter - hidden on mobile */}
          <Link
            href={getLocalizedPath('/contact-us', locale)}
            className="hidden sm:flex items-center gap-1.5 px-3 h-9 border-s border-white/20 hover:bg-white/10 uppercase transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>NEWSLETTER</span>
          </Link>

          {/* Contact - hidden on mobile */}
          <Link
            href={getLocalizedPath('/contact-us', locale)}
            className="hidden md:flex items-center px-3 h-9 border-s border-white/20 hover:bg-white/10 uppercase transition-colors"
          >
            <span>{isAr ? 'تواصل معنا' : 'CONTACT US'}</span>
          </Link>

          {/* FAQs - hidden on mobile */}
          <Link
            href={getLocalizedPath('/about-us', locale)}
            className="hidden md:flex items-center px-3 h-9 border-s border-white/20 hover:bg-white/10 uppercase transition-colors"
          >
            <span>FAQS</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
