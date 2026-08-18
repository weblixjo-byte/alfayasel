'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, User, Mail, MessageSquare } from 'lucide-react';
import { Locale } from '@/lib/i18n/config';

interface ContactFormProps {
  lang: Locale;
}

export const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const t = {
    en: {
      title: 'CONTACT US',
      desc: "Whether you're looking for answers, would like to solve a problem, or just want to let us know how we did, we're here to help.",
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Your Email',
      emailPlaceholder: 'name@example.com',
      messageLabel: 'Your Message',
      messagePlaceholder: 'How can we help you today?',
      sendBtn: 'SEND MESSAGE',
      sendingBtn: 'SENDING...',
      successTitle: 'Thank you! Your message has been sent.',
      successDesc: 'We have received your inquiry and will get back to you as soon as possible.',
      sendAnother: 'Send another message',
      errorTitle: 'Submission failed',
    },
    ar: {
      title: 'اتصل بنا',
      desc: 'سواء كنت تبحث عن إجابات، أو ترغب في حل مشكلة، أو تريد مشاركتنا رأيك، فنحن دائماً هنا لمساعدتك.',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسمك الكامل',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'name@example.com',
      messageLabel: 'رسالتك أو استفسارك',
      messagePlaceholder: 'اكتب رسالتك أو استفسارك هنا...',
      sendBtn: 'إرسال الرسالة',
      sendingBtn: 'جاري الإرسال...',
      successTitle: 'شكراً لك! تم إرسال رسالتك بنجاح.',
      successDesc: 'لقد استلمنا رسالتك وسيقوم فريقنا بالتواصل معك في أقرب وقت ممكن.',
      sendAnother: 'إرسال رسالة أخرى',
      errorTitle: 'فشل إرسال الرسالة',
    },
  }[isAr ? 'ar' : 'en'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Access key can be set in .env.local as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
      const accessKey =
        process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
        'b33cff69-e590-4fdc-89e6-68d87cda335e';

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Message from Al Fayasel Website - ${formData.name}`,
          from_name: 'Al Fayasel Labs Website',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(
          result.message ||
            (isAr
              ? 'حدث خطأ أثناء إرسال الرسالة. يرجى التحقق من المفتاح أو المحاولة لاحقاً.'
              : 'Failed to send message. Please verify the Web3Forms key or try again later.')
        );
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        isAr
          ? 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
          : 'Network error. Please check your internet connection.'
      );
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
          {t.title}
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed mt-2 max-w-xl">
          {t.desc}
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <h3 className="font-bold text-sm">{t.successTitle}</h3>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed ps-9">
            {t.successDesc}
          </p>
          <div className="ps-9 pt-2">
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {t.sendAnother}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          {/* Error Alert */}
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="block font-bold">{t.errorTitle}</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Hidden Spam Honeypot */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Name and Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0066b2]" />
                <span>{t.nameLabel}</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0066b2] focus:ring-4 focus:ring-[#0066b2]/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0066b2]" />
                <span>{t.emailLabel}</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0066b2] focus:ring-4 focus:ring-[#0066b2]/10 transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#0066b2]" />
              <span>{t.messageLabel}</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              placeholder={t.messagePlaceholder}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0066b2] focus:ring-4 focus:ring-[#0066b2]/10 transition-all shadow-2xs resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#0066b2] hover:bg-[#005594] disabled:bg-gray-400 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.sendingBtn}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.sendBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
