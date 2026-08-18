'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Locale } from '@/lib/i18n/config';

interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  locale: Locale;
}

export const ProductReviews = ({ productId, initialReviews, locale }: ProductReviewsProps) => {
  const isAr = locale === 'ar';
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([...reviews, data.review]);
        setSuccess(true);
        setName('');
        setComment('');
        setRating(5);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {isAr ? 'تقييمات العملاء' : 'Customer Reviews'}
      </h3>

      <div className="space-y-6 mb-10">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {isAr ? 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!' : 'No reviews yet. Be the first to review this product!'}
          </p>
        ) : (
          reviews.map((rev, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-sm text-gray-800">{rev.name}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl">
        <h4 className="font-bold text-gray-800 mb-4 text-sm">
          {isAr ? 'أضف تقييمك' : 'Write a Review'}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isAr ? 'التقييم' : 'Rating'}
            </label>
            <div className="flex gap-1 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isAr ? 'الاسم' : 'Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {isAr ? 'التعليق' : 'Comment'}
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-500 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-brand-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? '...' : isAr ? 'إرسال التقييم' : 'Submit Review'}
          </button>
          {success && (
            <p className="text-green-600 text-sm mt-2 font-bold">
              {isAr ? 'تم إرسال التقييم بنجاح!' : 'Review submitted successfully!'}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
