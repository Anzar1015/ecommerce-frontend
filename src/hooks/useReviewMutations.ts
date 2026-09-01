import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewApi } from '@/services/review.service';
import { extractErrorMessage } from '@/utils/errors';
import { reviewKeys } from './useProductReviews';
import { productKeys } from './useProducts';
import type { ReviewFormValues } from '@/types/review.types';

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ReviewFormValues) => reviewApi.create(productId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('Review submitted — it will appear once approved');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<Pick<ReviewFormValues, 'rating' | 'title' | 'comment'>> }) =>
      reviewApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('Review updated — it will be re-reviewed before it appears again');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('Review deleted');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useToggleHelpful() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.toggleHelpful(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

/** Admin moderation also invalidates the product cache — an approval changes
 * the product's denormalized rating shown on cards/detail pages. */
export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'hidden' }) =>
      reviewApi.adminModerate(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Review moderated');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.adminRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Review deleted');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
