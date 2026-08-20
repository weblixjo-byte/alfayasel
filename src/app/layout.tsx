import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Al Fayasel Laboratories | مختبرات الفياصل',
    template: '%s | Al Fayasel Laboratories',
  },
  description:
    'Al Fayasel Laboratories - High-quality pharmaceutical, hair, skin, and paramedical care in Jordan. مختبرات الفياصل - منتجات طبية وتجميلية متخصصة.',
  keywords: [
    'Al Fayasel Laboratories',
    'مختبرات الفياصل',
    'Tricho Cream',
    'Clean Face',
    'Alfatar Shampoo',
    'Urelol Cream',
    'Skincare Jordan',
    'Jordan Pharmacy',
  ],
  authors: [{ name: 'Al Fayasel Laboratories' }],
  metadataBase: new URL('https://alfayasel.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alfayasel.com',
    siteName: 'Al Fayasel Laboratories',
    images: [{ url: 'https://alfayasel.com/api/og?title=Al%20Fayasel%20Laboratories%20%7C%20%D9%85%D8%AE%D8%AA%D8%A8%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D9%81%D9%8A%D8%A7%D8%B5%D9%84&img=%2Fimages%2Falfayasel-logo-new-02.png', width: 1200, height: 630, type: 'image/png', alt: 'Al Fayasel Laboratories' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Fayasel Laboratories',
    description: 'High-quality pharmaceutical, hair, and skincare solutions in Jordan.',
    images: ['https://alfayasel.com/.netlify/images?url=/images/alfayasel-logo-new-02.png&w=1200&h=630&fit=contain&fm=png'],
  },
  verification: { google: 'Zf3o6bfH8aOHt4Km2nZgXFFO9h0_SNPgS5tUGTHNvZQ' },
  icons: {
    icon: '/images/alfayasel-logo-new-02.png',
    apple: '/images/alfayasel-logo-new-02.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to speed up any external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for common CDNs */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className="min-h-screen flex flex-col justify-between antialiased bg-woodmart-bg text-woodmart-text">
        {children}
      </body>
    </html>
  );
}
