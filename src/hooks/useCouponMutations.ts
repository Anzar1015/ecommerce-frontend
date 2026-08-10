import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponApi } from '@/services/coupon.service';
import { extractErrorMessage } from '@/utils/errors';
import { couponKeys } from './useCoupons';
import type { CouponFormValues } from '@/types/coupon.types';

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CouponFormValues) => couponApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success('Coupon created successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateCoupon(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<CouponFormValues>) => couponApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success('Coupon updated successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success('Coupon deleted successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
