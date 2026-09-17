import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentApi } from '@/services/payment.service';
import { orderApi } from '@/services/order.service';
import { extractErrorMessage } from '@/utils/errors';
import { orderKeys } from './useOrders';
import type { RazorpaySuccessResponse } from '@/types/razorpay.types';

/** The Razorpay key id is public and rarely changes — cache it for the session. */
export function useRazorpayConfig() {
  return useQuery({
    queryKey: ['payments', 'config'],
    queryFn: () => paymentApi.getConfig(),
    staleTime: Infinity,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: RazorpaySuccessResponse }) =>
      paymentApi.verify(orderId, payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      if (order.payment.status === 'paid') {
        toast.success('Payment successful!');
      } else {
        toast.error('Payment could not be verified. Please try again.');
      }
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

/** Re-initiates payment for an order still awaiting it — used when the
 * customer closed the Razorpay modal without paying, or a previous attempt
 * failed. */
export function useRetryPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderApi.retryPayment(orderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, amount, reason }: { orderId: string; amount?: number; reason?: string }) =>
      paymentApi.refund(orderId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('Refund processed');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
