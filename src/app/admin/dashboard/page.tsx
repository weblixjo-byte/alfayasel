import React from 'react';
import Link from 'next/link';
import { Plus, Package, ShoppingCart, ShieldCheck, DollarSign } from 'lucide-react';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import { SalesChart } from '@/components/admin/SalesChart';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  try {
    await dbConnect();

    // 1. Fetch counts
    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ isPaused: false });

    // 2. Fetch orders
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const totalOrders = orders.length;

    // Sum non-cancelled orders total revenue
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Recent 5 products
    const recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      orders: JSON.parse(JSON.stringify(orders)),
      recentProducts: JSON.parse(JSON.stringify(recentProducts)),
    };
  } catch (err) {
    console.error('Failed to get dashboard stats:', err);
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      orders: [],
      recentProducts: [],
      error: true,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 font-sans select-none">
      {stats.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded text-xs font-semibold flex items-center justify-between">
          <span>⚠️ Could not connect to database. Showing offline/fallback data. Please verify your MongoDB Atlas network whitelist access settings.</span>
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">STORE OVERVIEW</h2>
          <p className="text-xs text-gray-500">Live operational and performance metrics</p>
        </div>

        <Link
          href="/admin/products?action=new"
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 transition-colors flex items-center gap-2 max-w-fit rounded-none border border-gray-900"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Summary Cards (Editorial style: flat borders, white background, no neon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Revenue</span>
            <span className="text-2xl font-bold text-gray-900">
              {stats.totalRevenue.toFixed(2)} JOD
            </span>
          </div>
          <div className="w-10 h-10 border border-gray-200 text-gray-900 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Orders</span>
            <span className="text-2xl font-bold text-gray-900">{stats.totalOrders}</span>
          </div>
          <div className="w-10 h-10 border border-gray-200 text-gray-900 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Products</span>
            <span className="text-2xl font-bold text-gray-900">{stats.activeProducts}</span>
          </div>
          <div className="w-10 h-10 border border-gray-200 text-gray-900 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Average Order</span>
            <span className="text-2xl font-bold text-gray-900">
              {stats.averageOrderValue.toFixed(2)} JOD
            </span>
          </div>
          <div className="w-10 h-10 border border-gray-200 text-gray-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Analytics Chart Block */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">SALES VOLUME ANALYTICS</h3>
        <SalesChart orders={stats.orders} />
      </div>

      {/* Recent Catalog Additions */}
      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">RECENT PRODUCTS ADDITIONS</h3>
          <Link href="/admin/products" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider">
            View All Catalog →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {stats.recentProducts.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
              No products found in database
            </div>
          ) : (
            stats.recentProducts.map((product: any) => (
              <div key={product._id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900">{product.name.en}</h4>
                  <span className="text-[10px] text-gray-400 font-mono tracking-tight block mt-0.5">SKU: {product.sku}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">{product.price.toFixed(2)} JOD</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 border ${
                    product.isPaused
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {product.isPaused ? 'PAUSED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
