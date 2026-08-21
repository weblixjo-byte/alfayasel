import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/products';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const tag = searchParams.get('tag'); // new, featured, topSeller

    await dbConnect();
    const isAdmin = searchParams.get('admin') === 'true';
    let query: any = isAdmin ? {} : { isPaused: false };

    if (category) {
      const cat = INITIAL_CATEGORIES.find(c => c.slug === category);
      if (cat) {
        const subSlugs = cat.subcategories.map(sub => sub.slug);
        query.categorySlug = { $in: [category, ...subSlugs] };
      } else {
        query.categorySlug = category;
      }
    }

    if (tag === 'new') query.isNewArrival = true;
    if (tag === 'featured') query.isFeatured = true;
    if (tag === 'topSeller') query.isTopSeller = true;

    if (q) {
      query.$or = [
        { 'name.en': { $regex: q, $options: 'i' } },
        { 'name.ar': { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
      ];
    }

    let products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error('Failed to GET products:', error);
    return NextResponse.json({ success: false, count: 0, products: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
