'use server';

import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db/mongoose';
import Order, { IOrderItem } from '@/lib/models/Order';
import { sendOrderNotification } from '@/lib/utils/pushover';

export interface OrderInput {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export async function createOrder(data: OrderInput) {
  try {
    await dbConnect();

    // Generate unique order number (e.g., AF-170281-9481)
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AF-${timestamp}-${random}`;

    const newOrder = new Order({
      ...data,
      orderNumber,
      status: 'pending',
    });

    await newOrder.save();

    // Trigger Pushover notification alert in real-time
    await sendOrderNotification(newOrder);

    revalidatePath('/admin/orders');
    return { success: true, order: JSON.parse(JSON.stringify(newOrder)) };
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

export async function updateOrderStatus(
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  try {
    await dbConnect();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    return { success: true, order: JSON.parse(JSON.stringify(updatedOrder)) };
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}
