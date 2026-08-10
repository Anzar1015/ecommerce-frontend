import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type { Coupon, CouponFormValues, CouponQueryParams, ValidateCouponResult } from '@/types/coupon.types';

interface CouponListResult {
  coupons: Coupon[];
  pagination: PaginationMeta;
}

export const couponApi = {
  async list(params: CouponQueryParams): Promise<CouponListResult> {
    const { data } = await api.get<ApiSuccessResponse<CouponListResult>>('/coupons', { params });
    return data.data;
  },

  async getById(id: string): Promise<Coupon> {
    const { data } = await api.get<ApiSuccessResponse<{ coupon: Coupon }>>(`/coupons/${id}`);
    return data.data.coupon;
  },

  async create(values: CouponFormValues): Promise<Coupon> {
    const { data } = await api.post<ApiSuccessResponse<{ coupon: Coupon }>>('/coupons', values);
    return data.data.coupon;
  },

  async update(id: string, values: Partial<CouponFormValues>): Promise<Coupon> {
    const { data } = await api.patch<ApiSuccessResponse<{ coupon: Coupon }>>(`/coupons/${id}`, values);
    return data.data.coupon;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/coupons/${id}`);
  },

  async validate(code: string): Promise<ValidateCouponResult> {
    const { data } = await api.post<ApiSuccessResponse<ValidateCouponResult>>('/coupons/validate', { code });
    return data.data;
  },
};
