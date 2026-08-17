import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await dbConnect();

    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }, { sku: id }],
    });

    if (!product) {
      const fallback = INITIAL_PRODUCTS.find(
        (p) => p.id === id || p.slug === id || p.sku === id
      );
      if (fallback) {
        return NextResponse.json({ success: true, product: fallback });
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    const fallback = INITIAL_PRODUCTS.find(
      (p) => p.id === params.id || p.slug === params.id || p.sku === params.id
    );
    if (fallback) {
      return NextResponse.json({ success: true, product: fallback });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    await dbConnect();

    const updatedProduct = await Product.findOneAndUpdate(
      { $or: [{ _id: id }, { slug: id }] },
      body,
      { new: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();

    await Product.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
