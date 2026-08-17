import React from 'react';
import { MapPin, Phone, Mail, Printer, MessageCircle } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n/config';

interface ContactPageProps {
  params: { lang: Locale };
}

export default function ContactPage({ params: { lang } }: ContactPageProps) {
  const dict = getDictionary(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">{dict.topBar.contact}</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          We are here to assist you with product inquiries, order follow-ups, and partnership requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-200 pb-3">
            Al Fayasel Laboratories Office
          </h3>

          <div className="space-y-4 text-xs text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Address:</strong>
                <span>{dict.footer.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Telephone & Mobile:</strong>
                <span>{dict.footer.tel}</span>
                <span className="block">{dict.footer.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">WhatsApp Support:</strong>
                <a
                  href="https://wa.me/962776755550"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline font-bold"
                >
                  +962 7 7675 5550
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Printer className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Fax:</strong>
                <span>{dict.footer.fax}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-200 pb-3">
            Send us a message
          </h3>

          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Name</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Phone / Email</label>
              <input
                type="text"
                required
                placeholder="Phone number or email address"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Write your message or inquiry here..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
