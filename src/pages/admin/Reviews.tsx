import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { useAdminReviews } from '@/hooks/useProductReviews';
import { useModerateReview, useAdminDeleteReview } from '@/hooks/useReviewMutations';
import type { Review, ReviewStatus } from '@/types/review.types';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hidden', label: 'Hidden' },
];

const STATUS_BADGE_VARIANT: Record<ReviewStatus, 'default' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  hidden: 'default',
};

export default function AdminReviews() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReviewStatus | ''>('pending');
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const { data, isLoading, isError, refetch } = useAdminReviews({ page, limit: 20, status: status || undefined });
  const moderate = useModerateReview();
  const deleteReview = useAdminDeleteReview();

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    await deleteReview.mutateAsync(reviewToDelete.id);
    setReviewToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">Reviews</h1>
        <div className="w-48">
          <Select
            label=""
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ReviewStatus | '');
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !data || data.reviews.length === 0 ? (
        <EmptyState title="No reviews found" description="Nothing matches this filter." />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell>Review</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.reviews.map((review) => {
                const productName = typeof review.product === 'string' ? review.product : review.product.name;
                const customerName = typeof review.user === 'string' ? review.user : review.user.name;
                return (
                  <TableRow key={review.id}>
                    <TableCell className="max-w-[160px]">
                      <span className="line-clamp-1">{productName}</span>
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {review.rating}
                        <Star className="h-3.5 w-3.5 fill-semantic-warning text-semantic-warning" aria-hidden="true" />
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-1 font-medium text-text-primary">{review.title}</p>
                      <p className="line-clamp-1 text-xs text-text-muted">{review.comment}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE_VARIANT[review.status]}>{review.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {review.status !== 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={moderate.isPending}
                            onClick={() => moderate.mutate({ id: review.id, status: 'approved' })}
                          >
                            Approve
                          </Button>
                        )}
                        {review.status !== 'rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={moderate.isPending}
                            onClick={() => moderate.mutate({ id: review.id, status: 'rejected' })}
                          >
                            Reject
                          </Button>
                        )}
                        {review.status !== 'hidden' && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={moderate.isPending}
                            onClick={() => moderate.mutate({ id: review.id, status: 'hidden' })}
                          >
                            Hide
                          </Button>
                        )}
                        <button
                          type="button"
                          aria-label="Delete review"
                          onClick={() => setReviewToDelete(review)}
                          className="rounded-lg p-2 text-semantic-error hover:bg-semantic-error/10"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={!!reviewToDelete} onClose={() => setReviewToDelete(null)} title="Delete review" size="sm">
        <p className="text-sm text-text-secondary">
          Are you sure you want to permanently delete this review? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setReviewToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={deleteReview.isPending} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
