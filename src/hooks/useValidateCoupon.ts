import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponApi } from '@/services/coupon.service';
import { extractErrorMessage } from '@/utils/errors';

/** Previews a coupon's discount against the caller's live cart. The
 * checkout endpoint always re-validates the code itself — this is only for
 * showing the customer an estimate before they place the order. */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: (code: string) => couponApi.validate(code),
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
