'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@alfayasel.com');
  const [password, setPassword] = useState('Admin@123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMsg('Invalid admin credentials. Default: admin@alfayasel.com / Admin@123456');
      } else {
        // Use hard redirection to force browser session cookies reload, bypassing stale Next.js App Router cache
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-gray-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-brand-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Portal Login</h1>
          <p className="text-xs text-gray-500">
            Al Fayasel Laboratories Management Console
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 ps-10 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 ps-10 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-[11px] text-blue-800 space-y-1">
            <p className="font-bold">🔑 Default Credentials:</p>
            <p className="font-mono">Email: admin@alfayasel.com</p>
            <p className="font-mono">Password: Admin@123456</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Al Fayasel Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
