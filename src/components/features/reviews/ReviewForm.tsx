import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { StarRatingInput } from '@/components/ui/StarRatingInput';
import { reviewFormSchema, type ReviewFormSchemaValues } from '@/utils/reviewValidation';
import type { Review } from '@/types/review.types';

interface ReviewFormProps {
  initialReview?: Review;
  onSubmit: (values: ReviewFormSchemaValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  /** Editing an existing review doesn't support changing its images. */
  allowImages?: boolean;
}

export function ReviewForm({ initialReview, onSubmit, onCancel, isSubmitting, allowImages = true }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReviewFormSchemaValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: initialReview?.rating ?? 0,
      title: initialReview?.title ?? '',
      comment: initialReview?.comment ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-primary">Your rating</span>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <StarRatingInput value={field.value} onChange={field.onChange} />}
        />
        {errors.rating && <p className="text-sm text-semantic-error">{errors.rating.message}</p>}
      </div>

      <Input label="Title" placeholder="Sum up your experience" error={errors.title?.message} {...register('title')} />
      <Textarea
        label="Review"
        rows={4}
        placeholder="What did you like or dislike?"
        error={errors.comment?.message}
        {...register('comment')}
      />

      {allowImages && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-images" className="text-sm font-medium text-text-primary">
            Photos (optional)
          </label>
          <input
            id="review-images"
            type="file"
            accept="image/*"
            multiple
            {...register('images')}
            className="text-sm text-text-secondary"
          />
        </div>
      )}

      <div className="mt-2 flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialReview ? 'Save changes' : 'Submit review'}
        </Button>
      </div>
    </form>
  );
}
