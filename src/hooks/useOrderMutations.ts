import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderApi } from '@/services/order.service';
import { extractErrorMessage } from '@/utils/errors';
import { orderKeys } from './useOrders';
import type { CheckoutPayload } from '@/types/order.types';

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => orderApi.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('Order placed successfully!');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => orderApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('Order cancelled');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
