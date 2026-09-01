import { ThumbsUp, Trash2, Pencil } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { useToggleHelpful } from '@/hooks/useReviewMutations';
import { cn } from '@/utils/cn';
import type { Review } from '@/types/review.types';

interface ReviewCardProps {
  review: Review;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({ review, isOwn, onEdit, onDelete }: ReviewCardProps) {
  const toggleHelpful = useToggleHelpful();
  const authorName = typeof review.user === 'string' ? 'Customer' : review.user.name;

  return (
    <div className="flex flex-col gap-2 border-b border-surface-divider py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Rating value={review.rating} size="sm" />
            {review.isVerifiedPurchase && <Badge variant="success">Verified Purchase</Badge>}
          </div>
          <h3 className="text-sm font-semibold text-text-primary">{review.title}</h3>
        </div>
        {isOwn && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit review"
              className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-card"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete review"
              className="rounded-lg p-1.5 text-semantic-error hover:bg-semantic-error/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-text-secondary">{review.comment}</p>

      {review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((image) => (
            <img
              key={image.publicId}
              src={image.url}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
        <span>
          {authorName} &middot; {new Date(review.createdAt).toLocaleDateString()}
        </span>
        <button
          type="button"
          onClick={() => toggleHelpful.mutate(review.id)}
          disabled={isOwn || toggleHelpful.isPending}
          aria-pressed={review.hasVoted}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50',
            review.hasVoted && 'text-brand-primary'
          )}
        >
          <ThumbsUp className={cn('h-3.5 w-3.5', review.hasVoted && 'fill-current')} aria-hidden="true" />
          Helpful ({review.helpfulCount})
        </button>
      </div>
    </div>
  );
}
