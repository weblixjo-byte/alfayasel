'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash, Save, Sparkles, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { getStoreSettings, updateStoreSettings } from '@/lib/actions/settings';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function SettingsPage() {
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const res = await getStoreSettings();
      if (res.success && res.settings) {
        setBanners(res.settings.heroBanners || []);
      } else {
        setError(res.error || 'Failed to load store settings');
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleAddBanner = (imageUrl?: string) => {
    setError('');
    const cleanUrl = (imageUrl || newBanner).trim();
    if (!cleanUrl) return;

    if (banners.includes(cleanUrl)) {
      setError('هذه الصورة مضافة مسبقاً في السلايدر');
      return;
    }

    setBanners([...banners, cleanUrl]);
    setNewBanner('');
    setSuccess('تمت إضافة البانر إلى القائمة! اضغط حفظ الإعدادات لتثبيته في الموقع.');
  };

  const handleRemoveBanner = (index: number) => {
    setBanners(banners.filter((_, idx) => idx !== index));
    setSuccess('تم حذف البانر! اضغط حفظ الإعدادات لتثبيت التغيير.');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const res = await updateStoreSettings(banners);
    if (res.success) {
      setSuccess('تم حفظ وتحديث بنرات السلايدر في المتجر بنجاح!');
    } else {
      setError(res.error || 'فشل حفظ الإعدادات');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">إعدادات المتجر (Store Settings)</h1>
          <p className="text-xs text-gray-500 mt-1">إدارة صور وبنرات السلايدر الرئيسي في الصفحة الرئيسية</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0066b2] hover:bg-[#005594] disabled:bg-gray-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
        >
          <Save className="w-4 h-4" /> {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات (Save Settings)'}
        </button>
      </div>

      {/* Notifications */}
      {error && <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">{error}</div>}
      {success && <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Banners List & Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066b2]" /> بنرات السلايدر الرئيسي (Hero Slider Banners)
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                اختر صورة البانر مباشرة من جهازك أو موبايلك وسيتم إضافتها تلقائياً إلى سلايدر الصفحة الرئيسية
              </p>
            </div>

            {/* Image Uploader Input Area */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 space-y-3">
              <span className="font-bold text-xs text-gray-800 block">إضافة بانر جديد:</span>
              <ImageUploader
                value={newBanner}
                onChange={(img) => {
                  setNewBanner(img);
                  if (img) {
                    handleAddBanner(img);
                  }
                }}
                label="اختر صورة البانر (من الموبايل أو الكمبيوتر)"
                helperText="المقاس الموصى به: 1920x600 بكسل أو أي مقاس عرضي مناسب"
                aspectRatio="banner"
              />
            </div>

            {/* Current Active Banners List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-xs text-gray-900 flex items-center justify-between">
                <span>البنرات النشطة حالياً ({banners.length})</span>
                <span className="text-[10px] text-gray-400 font-normal">يتم العرض بنفس هذا الترتيب</span>
              </h4>

              {loading ? (
                <div className="text-center text-xs text-gray-400 py-8">جاري تحميل البنرات...</div>
              ) : banners.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-2xl space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="font-bold text-gray-600">لا توجد بنرات نشطة حالياً</p>
                  <p className="text-[10px]">استخدم أداة الاختيار أعلاه لرفع صور البانر من جهازك</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {banners.map((url, idx) => (
                    <div key={idx} className="relative bg-gray-50 border border-gray-200 rounded-2xl p-2.5 overflow-hidden group hover:border-blue-300 transition-all shadow-xs space-y-2">
                      <div className="relative w-full h-28 rounded-xl overflow-hidden bg-white border border-gray-150 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Banner ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 start-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                          بانر #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-gray-400 truncate max-w-[180px]">{url.slice(0, 35)}...</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBanner(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Trash className="w-3.5 h-3.5" /> حذف البانر
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Info Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>💡</span> تعليمات هامة للبنرات
            </h4>
            <ul className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#0066b2] font-bold">•</span>
                <span>يمكنك رفع الصور مباشرة من استوديو الموبايل أو بسحب وإفلات الملفات من الكمبيوتر.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066b2] font-bold">•</span>
                <span>يقوم النظام بضغط ومعالجة الصور تلقائياً للحفاظ على سرعة فائقة في فتح المتجر.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066b2] font-bold">•</span>
                <span>تأكد من الضغط على زر <strong>حفظ الإعدادات</strong> في الأعلى بعد إضافة أو حذف أي بانر.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066b2] font-bold">•</span>
                <span>البنرات متجاوبة وتعمل تلقائياً على شاشات الموبايل والتابلت والكمبيوتر وباللغتين.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
