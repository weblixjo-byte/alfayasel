'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  PackageCheck, 
  Eye, 
  X, 
  User, 
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
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
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
    const reason = window.prompt('يرجى كتابة سبب الإلغاء أو الرفض (سيتم إرساله للعميل عبر الإيميل تلقائياً):');
    if (!reason || reason.trim() === '') {
      alert('لا يمكن إلغاء الطلب بدون كتابة سبب الرفض.');
      return;
    }
    updateOrderStatus(orderId, 'cancelled', reason.trim());
  };

  const handleShippedOrder = (orderId: string) => {
    if (window.confirm('هل أنت تأكد من تحويل الطلب إلى "جاهز للتوصيل"؟ سيتم إرسال إيميل للزبون بأن الطلب في الطريق.')) {
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
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> قيد الانتظار
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
            <PackageCheck className="w-3.5 h-3.5" /> قيد التجهيز
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5" /> في الطريق للتوصيل
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> تم التسليم
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> مرفوض / ملغى
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> قبول الطلب
            </button>
            <button
              disabled={isBusy}
              onClick={() => handleRejectOrder(order._id)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" /> رفض
            </button>
          </div>
        );
      case 'processing':
        return (
          <button
            disabled={isBusy}
            onClick={() => handleShippedOrder(order._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" /> جاهز للتوصيل
          </button>
        );
      case 'shipped':
        return (
          <button
            disabled={isBusy}
            onClick={() => handleDeliveredOrder(order._id)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> تم تسليم الطلب
          </button>
        );
      case 'delivered':
        return (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <XCircle className="w-4 h-4" /> طلب ملغي
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">طلبات الزبائن (Customer Orders)</h1>
          <p className="text-xs text-gray-500 mt-1">متابعة إجراءات الطلبات وحالات التوصيل بخطوات مباشرة</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          تحديث القائمة 🔄
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
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
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">رقم الطلب (# Order)</th>
                  <th className="p-4">اسم الزبون</th>
                  <th className="p-4">العنوان والتواصل</th>
                  <th className="p-4">المنتجات التفصيلية</th>
                  <th className="p-4">الإجمالي</th>
                  <th className="p-4">حالة الطلب</th>
                  <th className="p-4">الإجراء التالي (Actions)</th>
                  <th className="p-4 text-end">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Order # */}
                    <td className="p-4">
                      <div className="font-mono font-extrabold text-[#0066b2] text-xs">{ord.orderNumber}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString('ar-JO')} {new Date(ord.createdAt).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{ord.customerName}</div>
                      {ord.customerEmail && (
                        <div className="text-[11px] text-gray-500 dir-ltr text-start">{ord.customerEmail}</div>
                      )}
                    </td>

                    {/* Contact & Address */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-800 font-bold" dir="ltr">{ord.customerPhone}</span>
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(ord.customerPhone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors"
                          title="تواصل عبر واتساب"
                        >
                          واتساب 💬
                        </a>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        <strong className="text-gray-700">{ord.customerCity}:</strong> {ord.customerAddress}
                      </div>
                    </td>

                    {/* Detailed Items Summary */}
                    <td className="p-4">
                      <div className="space-y-1 max-w-xs">
                        {ord.items && ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <span className="font-bold text-[#0066b2]">x{item.quantity}</span>
                            <span className="truncate font-semibold">{item.nameAr || item.nameEn}</span>
                            <span className="ms-auto text-gray-500 text-[10px]" dir="ltr">{item.price.toFixed(2)} JOD</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="p-4">
                      <div className="font-extrabold text-[#0066b2] text-sm">{ord.total.toFixed(2)} د.أ</div>
                      <div className="text-[10px] text-gray-400">(دفع عند الاستلام)</div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">{renderStatusBadge(ord.status)}</td>

                    {/* Action Step Buttons */}
                    <td className="p-4">{renderActionButtons(ord)}</td>

                    {/* View Details Button */}
                    <td className="p-4 text-end">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ms-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-8">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold">تفاصيل الطلب #{selectedOrder.orderNumber}</h2>
                  {renderStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString('ar-JO')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Customer Info Card */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#0066b2]" /> معلومات الزبون والتوصيل
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">اسم الزبون:</span>
                    <strong className="text-gray-900 text-sm">{selectedOrder.customerName}</strong>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[11px]">رقم الهاتف:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <strong className="text-gray-900 font-mono text-sm" dir="ltr">{selectedOrder.customerPhone}</strong>
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsApp(selectedOrder.customerPhone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        واتساب 💬
                      </a>
                    </div>
                  </div>

                  {selectedOrder.customerEmail && (
                    <div>
                      <span className="text-gray-500 block text-[11px]">البريد الإلكتروني:</span>
                      <strong className="text-gray-800 font-mono" dir="ltr">{selectedOrder.customerEmail}</strong>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500 block text-[11px]">المدينة والعنوان:</span>
                    <strong className="text-gray-900">{selectedOrder.customerCity} - {selectedOrder.customerAddress}</strong>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                    <span className="text-gray-500 block text-[11px]">ملاحظات الزبون:</span>
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.cancelReason && (
                  <div className="mt-2 pt-2 border-t border-rose-200 text-xs">
                    <span className="text-rose-600 font-bold block text-[11px]">سبب الإلغاء/الرفض:</span>
                    <p className="text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1">{selectedOrder.cancelReason}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  المنتجات المطلوبة ({selectedOrder.items?.length || 0})
                </h3>

                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.nameAr} className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                            <ShoppingCart className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-xs">{item.nameAr || item.nameEn}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{item.nameEn}</div>
                          {item.sku && <div className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</div>}
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <div className="font-bold text-gray-900">
                          {item.quantity} × {item.price.toFixed(2)} د.أ
                        </div>
                        <div className="font-extrabold text-[#0066b2] text-xs mt-0.5" dir="ltr">
                          {(item.quantity * item.price).toFixed(2)} JOD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold" dir="ltr">{selectedOrder.subtotal.toFixed(2)} JOD</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>رسوم التوصيل:</span>
                  <span className="font-bold" dir="ltr">{selectedOrder.deliveryFee.toFixed(2)} JOD</span>
                </div>
                <div className="flex items-center justify-between text-base font-extrabold text-[#0066b2] pt-2 border-t border-gray-200">
                  <span>المجموع الإجمالي:</span>
                  <span dir="ltr">{selectedOrder.total.toFixed(2)} JOD</span>
                </div>
              </div>

            </div>

            {/* Modal Footer with Actions */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
              <div>{renderActionButtons(selectedOrder)}</div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
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
