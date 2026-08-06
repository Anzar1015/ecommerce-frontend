import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/services/order.service';
import { orderKeys } from './useOrders';
import type { AdminOrderQueryParams } from '@/types/order.types';

export function useAdminOrders(params: AdminOrderQueryParams) {
  return useQuery({
    queryKey: orderKeys.adminList(params),
    queryFn: () => orderApi.adminList(params),
  });
}

export function useAdminOrderDetails(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.adminDetail(id ?? ''),
    queryFn: () => orderApi.adminGetOne(id as string),
    enabled: !!id,
  });
}
