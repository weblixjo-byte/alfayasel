'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, CheckCircle2, LogOut, Database, RefreshCw } from 'lucide-react';

export default function MohammadAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'info@weblix-jo.com' && password === 'Weblix-admin') {
      setIsAuthenticated(true);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة السر.' });
    }
  };

  const handleExecuteReset = async (action: string, confirmPromptText: string) => {
    if (!window.confirm(confirmPromptText)) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/mohammad-admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ أثناء العملية' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'فشل الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-right" dir="rtl">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">لوحة تحكم إدارية خاصة</h1>
            <p className="text-xs text-slate-400">خاص بنظام Weblix لتصفير قاعدة البيانات والتحكم الخارق</p>
          </div>

          {message && message.type === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@weblix-jo.com"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500 font-mono transition-colors text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">كلمة السر الخاصة</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-red-500 font-mono transition-colors text-left"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-colors shadow-lg shadow-red-600/20"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans text-right" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
                Weblix Super Admin
              </span>
              <h1 className="text-xl font-bold text-white">لوحة تصفير وإعادة ضبط قاعدة البيانات</h1>
            </div>
            <p className="text-xs text-slate-400">إدارة وحذف البيانات الكلية بضغطة زر - مسار خاص `/mohammad-admin`</p>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl transition-colors self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{message.type === 'success' ? 'نجحت العملية:' : 'تنبيه خطأ:'}</p>
              <p className="text-xs mt-0.5 opacity-90">{message.text}</p>
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200 text-xs leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">تحذير مهم جداً:</span> الإجراءات المتاحة أدناه تؤدي لحذف بيانات نهائية من قاعدة بيانات MongoDB وسيرفر الموقع. تذكر أن العملية لا يمكن التراجع عنها فور تنفيذها!
          </div>
        </div>

        {/* Grid of Reset Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Orders */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Collection: orders</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">تصفير الطلبات فقط</h3>
              <p className="text-xs text-slate-400 mt-1">يحذف جميع طلبات الزبائن المسجلة في النظام ويفرغ السجل بالكامل.</p>
            </div>
            <button
              disabled={loading}
              onClick={() =>
                handleExecuteReset('delete_orders', 'هل أنت متأكد تماماً من حذف جميع الطلبات المسجلة بصفة نهائية؟')
              }
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-blue-400" />
              <span>تصفير كافة الطلبات</span>
            </button>
          </div>

          {/* Card 2: Products */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Collection: products</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">تصفير المنتجات فقط</h3>
              <p className="text-xs text-slate-400 mt-1">يحذف جميع المنتجات المضافة في المتجر بما في ذلك الأحجام والأنواع.</p>
            </div>
            <button
              disabled={loading}
              onClick={() =>
                handleExecuteReset('delete_products', 'هل أنت متأكد من حذف جميع المنتجات من المتجر؟ سيتفرغ المتجر بالكامل!')
              }
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-indigo-400" />
              <span>تصفير كافة المنتجات</span>
            </button>
          </div>

          {/* Card 3: Categories */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Collection: categories</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">تصفير الأقسام فقط</h3>
              <p className="text-xs text-slate-400 mt-1">يحذف قائمة تصنيفات المتجر الرئيسية والفرعية.</p>
            </div>
            <button
              disabled={loading}
              onClick={() =>
                handleExecuteReset('delete_categories', 'هل أنت متأكد من حذف جميع تصنيفات وأقسام المتجر؟')
              }
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-purple-400" />
              <span>تصفير كافة الأقسام</span>
            </button>
          </div>

          {/* Card 4: Complete Wipe */}
          <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl space-y-4 hover:border-red-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs text-red-400 font-mono">WIPE ALL COLLECTIONS</span>
            </div>
            <div>
              <h3 className="font-bold text-red-200 text-base">تصفير كامل قاعدة البيانات (الشامل)</h3>
              <p className="text-xs text-red-300/70 mt-1">يحذف (الطلبات + المنتجات + الأقسام) دفعة واحدة ويعيد قاعدة البيانات لنقطة الصفر.</p>
            </div>
            <button
              disabled={loading}
              onClick={() =>
                handleExecuteReset(
                  'reset_all',
                  '⚠️ تنبيه خطير: هل أنت متأكد تماماً من حذف الطلبات، المنتجات، والأقسام بالكامل وبشكل نهائي؟'
                )
              }
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>تصفير وتفريغ قاعدة البيانات بالكامل 💥</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
