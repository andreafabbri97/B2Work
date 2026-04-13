'use client'

import React from 'react'
import { Star, User } from 'lucide-react'
import { useLanguage } from '@/components/b2colf/context/LanguageContext'
import type { Review } from '@/lib/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-accent fill-accent' : 'text-slate-300'}`}
        />
      ))}
    </div>
  )
}

export default function ReviewCard({ review }: { review: Review }) {
  const { t } = useLanguage()
  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary font-semibold text-sm">
            {review.reviewer_name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{review.reviewer_name || t('reviews.user_fallback')}</div>
            <StarRating rating={review.rating} />
          </div>
        </div>
        {review.created_at && (
          <span className="text-xs text-slate-400">
            {new Date(review.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
    </div>
  )
}

export function ReviewForm({ onSubmit, loading }: { onSubmit: (rating: number, comment: string) => void; loading?: boolean }) {
  const { t } = useLanguage()
  const [rating, setRating] = React.useState(0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [comment, setComment] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0 || comment.length < 10) return
    onSubmit(rating, comment)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('reviews.your_rating')}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition ${
                  i <= (hoverRating || rating) ? 'text-accent fill-accent' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('reviews.comment_label')}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('reviews.comment_placeholder')}
          rows={3}
          className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
        {comment.length > 0 && comment.length < 10 && (
          <p className="text-xs text-danger mt-1">Ancora {10 - comment.length} caratteri necessari</p>
        )}
      </div>

      <button
        type="submit"
        disabled={rating === 0 || comment.length < 10 || loading}
        className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('reviews.submitting') : t('reviews.submit')}
      </button>
    </form>
  )
}
