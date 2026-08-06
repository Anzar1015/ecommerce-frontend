import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/services/order.service';
import type { OrderHistoryQueryParams } from '@/types/order.types';

export const orderKeys = {
  all: ['orders'] as const,
  mine: (params: OrderHistoryQueryParams) => [...orderKeys.all, 'mine', params] as const,
  mineDetail: (id: string) => [...orderKeys.all, 'mine-detail', id] as const,
  admin: ['admin-orders'] as const,
  adminList: <T extends object>(params: T) => [...orderKeys.admin, 'list', params] as const,
  adminDetail: (id: string) => [...orderKeys.admin, 'detail', id] as const,
};

export function useMyOrders(params: OrderHistoryQueryParams) {
  return useQuery({
    queryKey: orderKeys.mine(params),
    queryFn: () => orderApi.myOrders(params),
  });
}

export function useMyOrderDetails(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.mineDetail(id ?? ''),
    queryFn: () => orderApi.myOrderDetails(id as string),
    enabled: !!id,
  });
}
