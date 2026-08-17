import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Editorial Sidebar */}
      <AdminSidebar />

      {/* Main Body content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 shrink-0 select-none">
          <h1 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            MANAGEMENT INTERFACE
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
            <span>PORTAL:</span>
            <span className="font-bold text-gray-900 uppercase">ACTIVE ADMIN SESSION</span>
          </div>
        </header>

        {/* Content panel */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
