'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  Check, 
  Truck, 
  X, 
  Package, 
  Eye, 
  RefreshCw,
  MessageCircle,
  MapPin,
  Phone,
  User,
  Mail,
  AlertCircle
} from 'lucide-react';

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
  customerEmail?: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cancelReason?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchOrders = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    else setLoading(true);
    
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        if (selectedOrder) {
          const updated = data.orders.find((o: OrderData) => o._id === selectedOrder._id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string, cancelReason: string = '') => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, cancelReason }),
      });
      if (res.ok) {
        const result = await res.json();
        const updatedObj = result.order || { status: newStatus };
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...updatedObj, status: newStatus as any, cancelReason } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, ...updatedObj, status: newStatus as any, cancelReason } : null);
        }
      } else {
        alert('حدث خطأ أثناء تحديث حالة الطلب');
      }
    } catch (err) {
      console.error('Error updating status', err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
    setActionLoadingId(null);
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'processing');
  };

  const handleRejectOrder = (orderId: string) => {
    const reason = window.prompt('سبب الإلغاء/الرفض (سيتم إرساله للعميل عبر الإيميل):');
    if (!reason || reason.trim() === '') return;
    updateOrderStatus(orderId, 'cancelled', reason.trim());
  };

  const handleShippedOrder = (orderId: string) => {
    if (window.confirm('تحويل الطلب إلى "جاهز للتوصيل" وإرسال إشعار للزبون؟')) {
      updateOrderStatus(orderId, 'shipped');
    }
  };

  const handleDeliveredOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('07')) {
      clean = '962' + clean.substring(1);
    }
    return clean;
  };

  const renderStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            قيد الانتظار
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50/80 border border-blue-200/60 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            جاري التجهيز
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50/80 border border-indigo-200/60 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            في الطريق للتوصيل
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            تم التسليم
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            ملغى
          </span>
        );
    }
  };

  const renderActionButtons = (order: OrderData) => {
    const isBusy = actionLoadingId === order._id;

    switch (order.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <button
              disabled={isBusy}
              onClick={() => handleAcceptOrder(order._id)}
              className="bg-black hover:bg-gray-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" /> قبول الطلب
            </button>
            <button
              disabled={isBusy}
              onClick={() => handleRejectOrder(order._id)}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              رفض
            </button>
          </div>
        );
      case 'processing':
        return (
          <button
            disabled={isBusy}
            onClick={() => handleShippedOrder(order._id)}
            className="bg-[#0066b2] hover:bg-[#00528e] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5" /> جاهز للتوصيل
          </button>
        );
      case 'shipped':
        return (
          <button
            disabled={isBusy}
            onClick={() => handleDeliveredOrder(order._id)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <Check className="w-3.5 h-3.5" /> تأكيد التسليم
          </button>
        );
      case 'delivered':
        return (
          <span className="text-xs text-gray-500 font-medium">مكتمل</span>
        );
      case 'cancelled':
        return (
          <span className="text-xs text-gray-400 font-medium">ملغى</span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">طلبات الزبائن</h1>
          <p className="text-xs text-gray-500 mt-0.5">إدارة ومتابعة طلبات الشراء وحالات التسليم</p>
        </div>
        <button 
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-gray-400 font-medium">جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-gray-800">لا يوجد طلبات</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              تظهر هنا جميع طلبات الشراء الجديدة من المتجر.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200/80 text-gray-500 font-medium text-[11px]">
                  <th className="py-3.5 px-4 text-start font-medium">رقم الطلب والتاريخ</th>
                  <th className="py-3.5 px-4 text-start font-medium">الزبون</th>
                  <th className="py-3.5 px-4 text-start font-medium">العنوان والتواصل</th>
                  <th className="py-3.5 px-4 text-start font-medium">المنتجات</th>
                  <th className="py-3.5 px-4 text-start font-medium">الإجمالي</th>
                  <th className="py-3.5 px-4 text-start font-medium">الحالة</th>
                  <th className="py-3.5 px-4 text-start font-medium">الإجراء</th>
                  <th className="py-3.5 px-4 text-end font-medium">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Order # */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-medium text-gray-900 text-xs">{ord.orderNumber}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('ar-JO')} • {new Date(ord.createdAt).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-900">{ord.customerName}</div>
                      {ord.customerEmail && (
                        <div className="text-[11px] text-gray-400 dir-ltr text-start mt-0.5">{ord.customerEmail}</div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-800 text-xs" dir="ltr">{ord.customerPhone}</span>
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(ord.customerPhone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          واتساب
                        </a>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {ord.customerCity} - {ord.customerAddress}
                      </div>
                    </td>

                    {/* Items Summary */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-xs">
                        {ord.items && ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700">
                            <span className="font-medium text-gray-400">{item.quantity}×</span>
                            <span className="truncate font-medium">{item.nameAr || item.nameEn}</span>
                            <span className="ms-auto text-gray-400 text-[10px]" dir="ltr">{item.price.toFixed(2)} JOD</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 text-xs">{ord.total.toFixed(2)} JOD</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{renderStatusBadge(ord.status)}</td>

                    {/* Action Step Buttons */}
                    <td className="py-3.5 px-4">{renderActionButtons(ord)}</td>

                    {/* View Details Button */}
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MINIMAL ULTRA-CLEAN MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-200 my-8">
            
            {/* Minimal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-900">طلب #{selectedOrder.orderNumber}</h2>
                {renderStatusBadge(selectedOrder.status)}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Customer Block */}
              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">تفاصيل الزبون والتوصيل</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(selectedOrder.createdAt).toLocaleString('ar-JO')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-[11px] block">الاسم</span>
                    <span className="font-medium text-gray-900 text-xs">{selectedOrder.customerName}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 text-[11px] block">رقم الهاتف</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-gray-900 text-xs" dir="ltr">{selectedOrder.customerPhone}</span>
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsApp(selectedOrder.customerPhone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        واتساب
                      </a>
                    </div>
                  </div>

                  {selectedOrder.customerEmail && (
                    <div>
                      <span className="text-gray-400 text-[11px] block">البريد الإلكتروني</span>
                      <span className="text-gray-700 font-mono text-xs" dir="ltr">{selectedOrder.customerEmail}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-400 text-[11px] block">المدينة والعنوان</span>
                    <span className="text-gray-900 text-xs">{selectedOrder.customerCity} - {selectedOrder.customerAddress}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-gray-200/60">
                    <span className="text-gray-400 text-[11px] block">ملاحظات الزبون:</span>
                    <p className="text-gray-700 mt-0.5 bg-white p-2 rounded border border-gray-200/60 text-[11px]">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.cancelReason && (
                  <div className="pt-2 border-t border-gray-200/60">
                    <span className="text-red-500 font-medium text-[11px] block">سبب الإلغاء:</span>
                    <p className="text-red-700 mt-0.5 bg-red-50/50 p-2 rounded border border-red-100 text-[11px]">{selectedOrder.cancelReason}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
                  المنتجات ({selectedOrder.items?.length || 0})
                </span>

                <div className="border border-gray-200/80 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.nameAr} className="w-10 h-10 object-cover rounded-lg border border-gray-200/60 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 text-xs">{item.nameAr || item.nameEn}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{item.nameEn}</div>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <div className="text-gray-500 font-medium text-[11px]">
                          {item.quantity} × {item.price.toFixed(2)} JOD
                        </div>
                        <div className="font-semibold text-gray-900 text-xs mt-0.5" dir="ltr">
                          {(item.quantity * item.price).toFixed(2)} JOD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono" dir="ltr">{selectedOrder.subtotal.toFixed(2)} JOD</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>التوصيل:</span>
                  <span className="font-mono" dir="ltr">{selectedOrder.deliveryFee.toFixed(2)} JOD</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-gray-200/80">
                  <span>الإجمالي:</span>
                  <span className="font-mono" dir="ltr">{selectedOrder.total.toFixed(2)} JOD</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <div>{renderActionButtons(selectedOrder)}</div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
