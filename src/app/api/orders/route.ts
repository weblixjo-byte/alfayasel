import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/utils/pushover';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      notes,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    if (!customerName || !customerPhone || !customerCity || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required shipping or items fields' }, { status: 400 });
    }

    const orderNumber = `ALF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    await dbConnect();
    const order = await Order.create({
      orderNumber,
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      notes: notes || '',
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
    });

    // Send Pushover alert (await it to prevent serverless function premature exit)
    try {
      await sendOrderNotification(order);
    } catch (err) {
      console.error('Pushover notification error:', err);
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: true, count: 0, orders: [] });
  }
}
