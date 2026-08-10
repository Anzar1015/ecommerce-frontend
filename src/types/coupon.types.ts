export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  firstOrderOnly: boolean;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  excludedProducts: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormValues {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perUserLimit?: number;
  firstOrderOnly: boolean;
  isActive: boolean;
}

export interface CouponQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ValidateCouponResult {
  valid: boolean;
  code: string;
  type: CouponType;
  value: number;
  discountAmount: number;
  subtotal: number;
  estimatedTotal: number;
}
