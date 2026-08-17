'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle2, Truck, AlertCircle, Package } from 'lucide-react';

interface OrderItem {
  productId: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <Clock className="w-3 h-3" /> قيد الانتظار (Pending)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <Package className="w-3 h-3" /> جاري التجهيز (Processing)
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <Truck className="w-3 h-3" /> تم الشحن (Shipped)
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" /> تم التوصيل (Delivered)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <AlertCircle className="w-3 h-3" /> ملغي (Cancelled)
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">طلبات الزبائن (Customer Orders)</h1>
          <p className="text-xs text-gray-500 mt-1">متابعة طلبات الدفع عند الاستلام وحالات التوصيل</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 font-medium">جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-800">لا توجد أي طلبات حالياً</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              عندما يقوم أي زبون بعمل طلب جديد من الموقع والدفع عند الاستلام، سيظهر الطلب هنا مباشرة بكافة تفاصيله.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">رقم الطلب (Order #)</th>
                  <th className="p-4">اسم الزبون (Customer)</th>
                  <th className="p-4">رقم الهاتف (Phone)</th>
                  <th className="p-4">المدينة والعنوان (Address)</th>
                  <th className="p-4">المنتجات (Items)</th>
                  <th className="p-4">الإجمالي (Total JOD)</th>
                  <th className="p-4">الحالة (Status)</th>
                  <th className="p-4 text-end">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-600">{ord.orderNumber}</td>
                    <td className="p-4 font-bold text-gray-900">{ord.customerName}</td>
                    <td className="p-4 font-mono text-gray-600" dir="ltr">{ord.customerPhone}</td>
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-gray-900">{ord.customerCity}</div>
                      <div className="text-[11px] text-gray-400">{ord.customerAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{ord.items?.length || 0} منتجات</span>
                    </td>
                    <td className="p-4 font-extrabold text-gray-900">{ord.total.toFixed(2)} د.أ</td>
                    <td className="p-4">{getStatusBadge(ord.status)}</td>
                    <td className="p-4 text-end text-gray-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString('ar-JO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
