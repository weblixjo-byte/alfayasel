import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { revalidatePath } from 'next/cache';

const ADMIN_EMAIL = 'info@weblix-jo.com';
const ADMIN_PASS = 'Weblix-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid credentials' },
        { status: 401 }
      );
    }

    await dbConnect();

    let message = '';

    if (action === 'delete_orders') {
      await Order.deleteMany({});
      message = 'All orders have been deleted successfully.';
    } else if (action === 'delete_products') {
      await Product.deleteMany({});
      message = 'All products have been deleted successfully.';
    } else if (action === 'delete_categories') {
      await Category.deleteMany({});
      message = 'All categories have been deleted successfully.';
    } else if (action === 'reset_all') {
      await Order.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      message = 'Entire database (Orders, Products, Categories) has been completely reset.';
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action requested' },
        { status: 400 }
      );
    }

    // Invalidate full Next.js cache
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process reset action' },
      { status: 500 }
    );
  }
}
