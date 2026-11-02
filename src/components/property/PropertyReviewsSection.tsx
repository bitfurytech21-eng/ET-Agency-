import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
} from 'lucide-react';
import { PropertyReviewRecord } from '../../data/propertyEnrichment';

interface PropertyReviewsSectionProps {
  propertyId: string;
  unitNumber: string;
  onRequireAuth?: () => void;
}

const REVIEWS_PER_PAGE = 4;

export const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({
  propertyId,
  unitNumber,
  onRequireAuth,
}) => {
  const [reviews, setReviews] = useState<PropertyReviewRecord[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Authenticated review submission state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [stayContext, setStayContext] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const isAuthenticated = Boolean(
    typeof window !== 'undefined' && window.localStorage.getItem('etl_php_token'),
  );

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${encodeURIComponent(propertyId)}/reviews`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating ?? null);
      } else {
        setReviews([]);
        setAverageRating(null);
      }
    } catch {
      setReviews([]);
      setAverageRating(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    setPage(1);
    setShowForm(false);
    setFormError(null);
    setFormSuccess(null);
    loadReviews();
  }, [loadReviews]);

  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const rounded = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[rounded] += 1;
    }
    return counts;
  }, [reviews]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [reviews, page]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('etl_php_token') : null;
    if (!token) {
      onRequireAuth?.();
      return;
    }
    if (content.trim().length < 12) {
      setFormError('Please share at least a brief sentence describing your stay experience.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch(`/api/properties/${encodeURIComponent(propertyId)}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          stayContext: stayContext.trim() || undefined,
          content: content.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not submit review.');
      }
      setTitle('');
      setStayContext('');
      setContent('');
      setRating(5);
      setShowForm(false);
      setFormSuccess(data.message || 'Your review has been published.');
      await loadReviews();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="type-h2 text-[#1b1d20]">Guest Reviews &amp; Verified Feedback</h2>
          <p className="type-body text-[#5c5046] mt-1">
            Genuine submissions from registered guests for {unitNumber}.
          </p>
        </div>

        <div>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setFormError(null);
              }}
              className="type-btn px-4 py-2.5 rounded-lg border border-[#dfd7cc] bg-white hover:border-[#00897d] text-[#1b1d20] transition-colors cursor-pointer whitespace-nowrap"
            >
              {showForm ? 'Close Review Form' : 'Write a Guest Review'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onRequireAuth}
              className="type-btn px-4 py-2.5 rounded-lg border border-[#dfd7cc] bg-white hover:border-[#00897d] text-[#5c5046] hover:text-[#1b1d20] transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign In to Leave a Review
            </button>
          )}
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 type-support flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Authenticated Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-5 sm:p-6 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-4"
        >
          <h3 className="type-h4 text-[#1b1d20]">Share Your Experience at {unitNumber}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block type-label text-[#1b1d20] mb-1.5">Overall Rating</label>
              <div className="flex items-center gap-1.5 h-11">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[#cfc6ba]'
                      }`}
                    />
                  </button>
                ))}
                <span className="type-support font-semibold text-[#1b1d20] ml-1 tabular-nums">
                  {rating}.0 / 5
                </span>
              </div>
            </div>

            <div>
              <label className="block type-label text-[#1b1d20] mb-1.5">Headline (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quiet, spotless apartment"
                className="w-full h-11 px-3 bg-white border border-[#dfd7cc] rounded-lg text-sm text-[#1b1d20]"
              />
            </div>

            <div>
              <label className="block type-label text-[#1b1d20] mb-1.5">Stay Type (Optional)</label>
              <input
                type="text"
                value={stayContext}
                onChange={(e) => setStayContext(e.target.value)}
                placeholder="e.g. 45-Day Relocation Stay"
                className="w-full h-11 px-3 bg-white border border-[#dfd7cc] rounded-lg text-sm text-[#1b1d20]"
              />
            </div>
          </div>

          <div>
            <label className="block type-label text-[#1b1d20] mb-1.5">Your Review *</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the residence condition, comfort, Wi-Fi reliability, and host communication..."
              className="w-full p-3 bg-white border border-[#dfd7cc] rounded-lg text-sm text-[#1b1d20]"
            />
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 type-support flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="type-btn px-4 py-2 rounded-lg text-[#5c5046] hover:text-[#1b1d20] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="type-btn px-5 py-2.5 rounded-lg bg-[#00b7a8] hover:bg-[#009b8e] disabled:opacity-50 text-white inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publish Review</span>
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-8 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl flex items-center justify-center gap-2.5 text-[#5c5046]">
          <Loader2 className="w-5 h-5 animate-spin text-[#00897d]" />
          <span className="type-body">Loading verified guest reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl space-y-2">
          <h3 className="type-h4 text-[#1b1d20]">No Guest Reviews Recorded Yet for {unitNumber}</h3>
          <p className="type-body text-[#5c5046]">
            We only display authentic reviews submitted by registered guests. Once a guest completes a stay and submits feedback for this residence, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Bar + Star Distribution */}
          <div className="p-5 sm:p-6 bg-[#faf8f5] border border-[#e6dfd5] rounded-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 space-y-1 tabular-nums">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#1b1d20]">
                  {averageRating?.toFixed(1) || '5.0'}
                </span>
                <span className="type-support text-[#697076]">out of 5.0</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(averageRating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[#dfd7cc]'
                    }`}
                  />
                ))}
              </div>
              <p className="type-support text-[#5c5046] pt-1">
                Based on {reviews.length} {reviews.length === 1 ? 'guest review' : 'guest reviews'}
              </p>
            </div>

            <div className="md:col-span-8 space-y-1.5 tabular-nums">
              {([5, 4, 3, 2, 1] as const).map((starLevel) => {
                const count = ratingDistribution[starLevel];
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={starLevel} className="flex items-center gap-3 type-support">
                    <span className="w-12 text-[#5c5046] font-medium">{starLevel} stars</span>
                    <div className="flex-1 h-2 bg-[#e6dfd5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00897d] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#697076]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedReviews.map((rev) => (
              <article
                key={rev.id}
                className="p-5 bg-white border border-[#e6dfd5] rounded-xl flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#dfd7cc]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="type-support text-[#697076] tabular-nums">
                      {rev.createdAt.split('T')[0]}
                    </span>
                  </div>

                  {rev.title && (
                    <h4 className="type-nav font-semibold text-[#1b1d20]">{rev.title}</h4>
                  )}

                  <p className="type-body text-[#434a4f]">{rev.content}</p>
                </div>

                {/* Unboxed Clean Metadata Footer */}
                <div className="pt-3 border-t border-[#efe9e0] type-support text-[#697076] flex flex-wrap items-center gap-1.5">
                  <strong className="font-semibold text-[#1b1d20]">{rev.authorName}</strong>
                  {rev.authorRole && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{rev.authorRole}</span>
                    </>
                  )}
                  {rev.stayContext && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{rev.stayContext}</span>
                    </>
                  )}
                  {rev.verifiedBooking && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#00897d] font-semibold">Verified Stay</span>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 tabular-nums">
              <span className="type-support text-[#697076]">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="type-btn px-3 py-1.5 rounded-lg border border-[#dfd7cc] bg-white disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="type-btn px-3 py-1.5 rounded-lg border border-[#dfd7cc] bg-white disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
