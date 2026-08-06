import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderApi } from '@/services/order.service';
import { extractErrorMessage } from '@/utils/errors';
import { orderKeys } from './useOrders';
import type { OrderStatus } from '@/types/order.types';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
      orderApi.adminUpdateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.admin });
      toast.success('Order status updated');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
