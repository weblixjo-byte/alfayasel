'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ArrowLeft, FolderKanban, Settings } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderKanban },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-e border-gray-200 p-6 flex flex-col justify-between shrink-0 md:min-h-screen select-none font-sans">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-gray-900 rounded-none flex items-center justify-center font-bold text-gray-900 text-xs">
            AF
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-gray-900 leading-none">AL FAYASEL</h2>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mt-1 block">Admin Console</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 transition-all text-xs uppercase tracking-wider font-bold rounded-none ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-s-2 border-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-s-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Store</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-red-600 hover:bg-red-50 px-3.5 py-2.5 border border-red-200 transition-colors rounded-none"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
