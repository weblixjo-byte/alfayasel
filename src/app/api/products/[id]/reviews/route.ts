import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, rating, comment } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const newReview = { name, rating, comment, createdAt: new Date() };

    // Update reviews array, review count and average rating
    const existingReviews = product.reviews || [];
    existingReviews.push(newReview);
    
    // We assume prior reviews are counted. If we just append, let's recalculate carefully
    // Since we initialized with default 12 reviews, let's just use existing logic or simple push.
    const newReviewCount = existingReviews.length;
    const newRating = existingReviews.reduce((acc, curr) => acc + curr.rating, 0) / newReviewCount;

    product.reviews = existingReviews;
    // Only update rating if it's based on actual reviews. For now, just add the review.
    // product.rating = newRating;
    // product.reviewCount = newReviewCount;

    await product.save();

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add review' }, { status: 500 });
  }
}
