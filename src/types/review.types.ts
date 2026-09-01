export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type ReviewSort = 'recent' | 'highest' | 'lowest' | 'helpful';

export interface ReviewImage {
  url: string;
  publicId: string;
}

export interface Review {
  id: string;
  user: string | { id: string; name: string; email?: string };
  product: string | { id: string; name: string; slug: string };
  order: string;
  rating: number;
  title: string;
  comment: string;
  images: ReviewImage[];
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  /** Whether the current viewer has voted this review helpful — only present when authenticated. */
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export interface ProductReviewsQueryParams {
  page?: number;
  limit?: number;
  rating?: number;
  sort?: ReviewSort;
}

export interface AdminReviewQueryParams {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  productId?: string;
}

export interface ReviewFormValues {
  rating: number;
  title: string;
  comment: string;
  images?: FileList;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: string;
}
