import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderCancelledEmail, sendOrderShippedEmail } from '@/lib/utils/email';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { status, cancelReason } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status === 'cancelled' && cancelReason) {
      await sendOrderCancelledEmail(updatedOrder, cancelReason);
    } else if (status === 'shipped') {
      await sendOrderShippedEmail(updatedOrder);
    }


    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
