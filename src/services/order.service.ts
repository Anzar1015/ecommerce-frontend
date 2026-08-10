import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type {
  Order,
  CheckoutPayload,
  OrderHistoryQueryParams,
  AdminOrderQueryParams,
  OrderStatus,
  UpdateOrderShippingPayload,
} from '@/types/order.types';

interface OrderListResult {
  orders: Order[];
  pagination: PaginationMeta;
}

export const orderApi = {
  async checkout(payload: CheckoutPayload): Promise<Order> {
    const { data } = await api.post<ApiSuccessResponse<{ order: Order }>>('/orders/checkout', payload);
    return data.data.order;
  },

  async myOrders(params: OrderHistoryQueryParams): Promise<OrderListResult> {
    const { data } = await api.get<ApiSuccessResponse<OrderListResult>>('/orders', { params });
    return data.data;
  },

  async myOrderDetails(id: string): Promise<Order> {
    const { data } = await api.get<ApiSuccessResponse<{ order: Order }>>(`/orders/${id}`);
    return data.data.order;
  },

  async cancel(id: string, reason?: string): Promise<Order> {
    const { data } = await api.post<ApiSuccessResponse<{ order: Order }>>(`/orders/${id}/cancel`, {
      reason,
    });
    return data.data.order;
  },

  async adminList(params: AdminOrderQueryParams): Promise<OrderListResult> {
    const { data } = await api.get<ApiSuccessResponse<OrderListResult>>('/orders/admin/all', { params });
    return data.data;
  },

  async adminGetOne(id: string): Promise<Order> {
    const { data } = await api.get<ApiSuccessResponse<{ order: Order }>>(`/orders/admin/${id}`);
    return data.data.order;
  },

  async adminUpdateStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const { data } = await api.patch<ApiSuccessResponse<{ order: Order }>>(
      `/orders/admin/${id}/status`,
      { status, note }
    );
    return data.data.order;
  },

  async adminUpdateShipping(id: string, payload: UpdateOrderShippingPayload): Promise<Order> {
    const { data } = await api.patch<ApiSuccessResponse<{ order: Order }>>(
      `/orders/admin/${id}/shipping`,
      payload
    );
    return data.data.order;
  },
};
