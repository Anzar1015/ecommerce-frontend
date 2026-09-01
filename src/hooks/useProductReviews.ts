import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { reviewApi } from '@/services/review.service';
import type { AdminReviewQueryParams, ProductReviewsQueryParams } from '@/types/review.types';

export const reviewKeys = {
  all: ['reviews'] as const,
  product: (productId: string, params: ProductReviewsQueryParams) =>
    [...reviewKeys.all, 'product', productId, params] as const,
  eligibility: (productId: string) => [...reviewKeys.all, 'eligibility', productId] as const,
  admin: (params: unknown) => [...reviewKeys.all, 'admin', params] as const,
};

export function useProductReviews(productId: string | undefined, params: ProductReviewsQueryParams) {
  return useQuery({
    queryKey: reviewKeys.product(productId ?? '', params),
    queryFn: () => reviewApi.listForProduct(productId as string, params),
    enabled: !!productId,
    placeholderData: keepPreviousData,
  });
}

export function useReviewEligibility(productId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: reviewKeys.eligibility(productId ?? ''),
    queryFn: () => reviewApi.getEligibility(productId as string),
    enabled: enabled && !!productId,
  });
}

export function useAdminReviews(params: AdminReviewQueryParams) {
  return useQuery({
    queryKey: reviewKeys.admin(params),
    queryFn: () => reviewApi.adminList(params),
    placeholderData: keepPreviousData,
  });
}
