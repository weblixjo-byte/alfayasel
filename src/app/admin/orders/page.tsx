'use client';

import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Clock, Truck } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: 'ord-1',
      orderNumber: 'ALF-849201',
      customerName: 'Sami Al-Khatib',
      phone: '0776755550',
      city: 'Amman',
      total: 18.20,
      deliveryFee: 0.00,
      status: 'pending',
      date: '2026-08-16',
      itemsCount: 2,
    },
    {
      id: 'ord-2',
      orderNumber: 'ALF-529104',
      customerName: 'Layla Mansour',
      phone: '0795123456',
      city: 'Irbid',
      total: 8.80,
      deliveryFee: 2.00,
      status: 'shipped',
      date: '2026-08-15',
      itemsCount: 1,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Customer COD Orders</h1>
        <p className="text-xs text-gray-500">Manage orders and delivery statuses</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-start border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total (JOD)</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-mono font-bold text-brand-600">{ord.orderNumber}</td>
                <td className="p-4 font-bold text-gray-900">{ord.customerName}</td>
                <td className="p-4 font-mono text-gray-600">{ord.phone}</td>
                <td className="p-4 text-gray-600">{ord.city}</td>
                <td className="p-4">{ord.itemsCount} items</td>
                <td className="p-4 font-extrabold text-gray-900">{ord.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
