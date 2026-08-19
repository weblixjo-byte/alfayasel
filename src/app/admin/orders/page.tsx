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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
      } else {
        alert('حدث خطأ أثناء تحديث حالة الطلب');
      }
    } catch (err) {
      console.error('Error updating status', err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const getStatusBadge = (order: OrderData) => {
    const status = order.status;
    let badgeClass = '';
    let Icon = Clock;
    let label = '';

    switch (status) {
      case 'pending':
        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        Icon = Clock;
        label = 'قيد الانتظار';
        break;
      case 'processing':
        badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
        Icon = Package;
        label = 'جاري التجهيز';
        break;
      case 'shipped':
        badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
        Icon = Truck;
        label = 'تم الشحن';
        break;
      case 'delivered':
        badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        Icon = CheckCircle2;
        label = 'مكتمل / تم التوصيل';
        break;
      case 'cancelled':
        badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
        Icon = AlertCircle;
        label = 'ملغي';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
        Icon = Clock;
        label = status;
    }

    return (
      <div className="flex flex-col gap-2">
        <span className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${badgeClass}`}>
          <Icon className="w-3 h-3" /> {label}
        </span>
        <select 
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none focus:border-brand-500 cursor-pointer"
          value={status}
          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
        >
          <option value="pending">قيد الانتظار (Pending)</option>
          <option value="processing">جاري التجهيز (Processing)</option>
          <option value="shipped">تم الشحن (Shipped)</option>
          <option value="delivered">مكتمل (Delivered)</option>
          <option value="cancelled">ملغي (Cancelled)</option>
        </select>
      </div>
    );
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
            <h3 className="font-bold text-sm text-gray-800">لا يوجد أي طلبات حالياً</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              عندما يقوم أي زبون بعمل طلب جديد من الموقع، سيظهر هنا مباشرة مع كافة التفاصيل.
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
                    <td className="p-4">{getStatusBadge(ord)}</td>
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
