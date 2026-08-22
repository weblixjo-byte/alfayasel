import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';
import { INITIAL_CATEGORIES } from '@/lib/data/products';

export const revalidate = 300; // Cache for 5 minutes at edge

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: 1 });
    return NextResponse.json(
      { success: true, count: categories.length, categories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    console.error('Failed to GET categories:', error);
    return NextResponse.json({ success: false, count: 0, categories: [] }, { status: 500 });
  }
}
