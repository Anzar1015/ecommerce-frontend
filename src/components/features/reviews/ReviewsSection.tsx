import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { RatingSummaryPanel } from './RatingSummaryPanel';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '@/hooks/useAuth';
import { useProductReviews, useReviewEligibility } from '@/hooks/useProductReviews';
import { useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useReviewMutations';
import { cn } from '@/utils/cn';
import type { Review, ReviewSort } from '@/types/review.types';
import type { ReviewFormSchemaValues } from '@/utils/reviewValidation';

const SORT_OPTIONS: { value: ReviewSort; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' },
];

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<ReviewSort>('recent');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const { data, isLoading, isError, refetch } = useProductReviews(productId, { page, limit: 10, rating, sort });
  const { data: eligibility } = useReviewEligibility(productId, isAuthenticated);
  const createReview = useCreateReview(productId);
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const handleCreate = async (values: ReviewFormSchemaValues) => {
    await createReview.mutateAsync({ ...values, images: values.images });
    setIsFormOpen(false);
  };

  const handleUpdate = async (values: ReviewFormSchemaValues) => {
    if (!editingReview) return;
    await updateReview.mutateAsync({
      id: editingReview.id,
      values: { rating: values.rating, title: values.title, comment: values.comment },
    });
    setEditingReview(null);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    await deleteReview.mutateAsync(reviewToDelete.id);
    setReviewToDelete(null);
  };

  return (
    <section className="mt-12 border-t border-surface-divider pt-8">
      <h2 className="text-xl font-semibold text-text-primary">Ratings &amp; Reviews</h2>

      {isLoading ? (
        <Skeleton className="mt-4 h-32 w-full" />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mt-4 rounded-xl border border-surface-border bg-white p-4">
            <RatingSummaryPanel summary={data.summary} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRating(undefined);
                  setPage(1);
                }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium',
                  rating === undefined
                    ? 'border-brand-primary bg-brand-accent text-brand-primary'
                    : 'border-surface-border text-text-secondary hover:bg-surface-card'
                )}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setPage(1);
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium',
                    rating === star
                      ? 'border-brand-primary bg-brand-accent text-brand-primary'
                      : 'border-surface-border text-text-secondary hover:bg-surface-card'
                  )}
                >
                  {star} ★
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-44">
                <Select
                  label=""
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as ReviewSort);
                    setPage(1);
                  }}
                  options={SORT_OPTIONS}
                />
              </div>

              {isAuthenticated ? (
                eligibility?.canReview && (
                  <Button size="sm" onClick={() => setIsFormOpen(true)}>
                    <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                    Write a review
                  </Button>
                )
              ) : (
                <Link to="/login" className="text-sm font-medium text-brand-primary hover:underline">
                  Log in to write a review
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4">
            {data.reviews.length === 0 ? (
              <EmptyState title="No reviews yet" description="Be the first to share your thoughts on this product." />
            ) : (
              <div className="rounded-xl border border-surface-border bg-white px-4">
                {data.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwn={!!user && typeof review.user !== 'string' && review.user.id === user.id}
                    onEdit={() => setEditingReview(review)}
                    onDelete={() => setReviewToDelete(review)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Write a review">
        <ReviewForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} isSubmitting={createReview.isPending} />
      </Modal>

      <Modal isOpen={!!editingReview} onClose={() => setEditingReview(null)} title="Edit your review">
        {editingReview && (
          <ReviewForm
            initialReview={editingReview}
            onSubmit={handleUpdate}
            onCancel={() => setEditingReview(null)}
            isSubmitting={updateReview.isPending}
            allowImages={false}
          />
        )}
      </Modal>

      <Modal isOpen={!!reviewToDelete} onClose={() => setReviewToDelete(null)} title="Delete review" size="sm">
        <p className="text-sm text-text-secondary">Are you sure you want to delete your review? This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setReviewToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteReview.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </section>
  );
}
