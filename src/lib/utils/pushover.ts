import { IOrder } from '../models/Order';

export async function sendOrderNotification(order: IOrder): Promise<boolean> {
  const token = process.env.PUSHOVER_API_TOKEN;
  const user = process.env.PUSHOVER_USER_KEY;

  if (!token || !user) {
    console.warn('Pushover credentials are not configured.');
    return false;
  }

  const itemsList = order.items
    .map((item) => `${item.nameEn} (x${item.quantity})`)
    .join(', ');

  const message = `New Order Placed!\nOrder Number: ${order.orderNumber}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nCity: ${order.customerCity}\nTotal: ${order.total.toFixed(2)} JOD\nItems: ${itemsList}`;

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
        title: 'Al Fayasel Store Alert',
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Pushover API returned an error:', errData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Pushover notification:', error);
    return false;
  }
}
