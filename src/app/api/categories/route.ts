import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';
import { INITIAL_CATEGORIES } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    console.error('Failed to GET categories:', error);
    return NextResponse.json({ success: false, count: 0, categories: [] }, { status: 500 });
  }
}
