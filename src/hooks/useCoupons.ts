import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { couponApi } from '@/services/coupon.service';
import type { CouponQueryParams } from '@/types/coupon.types';

export const couponKeys = {
  all: ['coupons'] as const,
  list: (params: CouponQueryParams) => [...couponKeys.all, 'list', params] as const,
  detail: (id: string) => [...couponKeys.all, 'detail', id] as const,
};

export function useCoupons(params: CouponQueryParams) {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCoupon(id: string | undefined) {
  return useQuery({
    queryKey: couponKeys.detail(id ?? ''),
    queryFn: () => couponApi.getById(id as string),
    enabled: !!id,
  });
}
