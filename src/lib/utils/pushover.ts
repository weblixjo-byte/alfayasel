import { IOrder } from '../models/Order';

export async function sendOrderNotification(order: IOrder | any): Promise<boolean> {
  const token = process.env.PUSHOVER_API_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;

  if (!token || !user) {
    console.warn('Pushover credentials (PUSHOVER_API_TOKEN or PUSHOVER_USER_KEY) are not configured.');
    return false;
  }

  const itemsFormatted = (order.items || [])
    .map(
      (item: any, idx: number) =>
        `${idx + 1}. ${item.nameAr || item.nameEn} (x${item.quantity}) - ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)} JOD`
    )
    .join('\n');

  const message = `🎊 طلب جديد من متجر الفيصل!

📦 رقم الطلب: ${order.orderNumber}
👤 العميل: ${order.customerName}
📱 الهاتف: ${order.customerPhone}
🏙️ المدينة: ${order.customerCity}
📍 العنوان: ${order.customerAddress}
${order.notes ? `📝 ملاحظات: ${order.notes}\n` : ''}
🛍️ المنتجات المطلوبة:
${itemsFormatted}

💵 المجموع: ${Number(order.subtotal || 0).toFixed(2)} JOD
🚚 التوصيل: ${Number(order.deliveryFee || 0).toFixed(2)} JOD
💰 الإجمالي النهائي: ${Number(order.total || 0).toFixed(2)} JOD`;

  try {
    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        user,
        message,
        title: `✅ طلب جديد: ${order.orderNumber} (${Number(order.total || 0).toFixed(2)} JOD)`,
        sound: 'cashregister',
        priority: 1,
        url: 'https://alfayasel.com/admin/orders',
        url_title: 'عرض الطلبات في لوحة التحكم',
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Pushover API returned an error:', errData);
      return false;
    }

    console.log(`[PUSHOVER] Successfully sent notification for order ${order.orderNumber}`);
    return true;
  } catch (error) {
    console.error('Failed to send Pushover notification:', error);
    return false;
  }
}
