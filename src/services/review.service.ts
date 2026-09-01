import { api } from './api';
import { buildFormData } from '@/utils/buildFormData';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type {
  Review,
  RatingSummary,
  ProductReviewsQueryParams,
  AdminReviewQueryParams,
  ReviewFormValues,
  ReviewEligibility,
} from '@/types/review.types';

type ModerationStatus = 'approved' | 'rejected' | 'hidden';

interface ProductReviewsResult {
  reviews: Review[];
  pagination: PaginationMeta;
  summary: RatingSummary;
}

interface AdminReviewsResult {
  reviews: Review[];
  pagination: PaginationMeta;
}

export const reviewApi = {
  async listForProduct(productId: string, params: ProductReviewsQueryParams): Promise<ProductReviewsResult> {
    const { data } = await api.get<ApiSuccessResponse<ProductReviewsResult>>(
      `/reviews/product/${productId}`,
      { params }
    );
    return data.data;
  },

  async getEligibility(productId: string): Promise<ReviewEligibility> {
    const { data } = await api.get<ApiSuccessResponse<ReviewEligibility>>(`/reviews/eligibility/${productId}`);
    return data.data;
  },

  async create(productId: string, values: ReviewFormValues): Promise<Review> {
    const { data } = await api.post<ApiSuccessResponse<{ review: Review }>>(
      '/reviews',
      buildFormData({ ...values, productId }),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.review;
  },

  async update(id: string, values: Partial<Pick<ReviewFormValues, 'rating' | 'title' | 'comment'>>): Promise<Review> {
    const { data } = await api.patch<ApiSuccessResponse<{ review: Review }>>(`/reviews/${id}`, values);
    return data.data.review;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },

  async toggleHelpful(id: string): Promise<Review> {
    const { data } = await api.post<ApiSuccessResponse<{ review: Review }>>(`/reviews/${id}/helpful`);
    return data.data.review;
  },

  async adminList(params: AdminReviewQueryParams): Promise<AdminReviewsResult> {
    const { data } = await api.get<ApiSuccessResponse<AdminReviewsResult>>('/reviews/admin/all', { params });
    return data.data;
  },

  async adminModerate(id: string, status: ModerationStatus): Promise<Review> {
    const { data } = await api.patch<ApiSuccessResponse<{ review: Review }>>(
      `/reviews/admin/${id}/status`,
      { status }
    );
    return data.data.review;
  },

  async adminRemove(id: string): Promise<void> {
    await api.delete(`/reviews/admin/${id}`);
  },
};
