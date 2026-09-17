import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Order } from '@/types/order.types';
import type { RazorpaySuccessResponse } from '@/types/razorpay.types';

export const paymentApi = {
  async getConfig(): Promise<{ razorpayKeyId: string | null }> {
    const { data } = await api.get<ApiSuccessResponse<{ razorpayKeyId: string | null }>>('/payments/config');
    return data.data;
  },

  async verify(orderId: string, payload: RazorpaySuccessResponse): Promise<Order> {
    const { data } = await api.post<ApiSuccessResponse<{ order: Order }>>(
      `/payments/${orderId}/verify`,
      payload
    );
    return data.data.order;
  },

  async refund(orderId: string, amount: number | undefined, reason: string | undefined): Promise<Order> {
    const { data } = await api.post<ApiSuccessResponse<{ order: Order }>>(`/payments/${orderId}/refund`, {
      amount,
      reason,
    });
    return data.data.order;
  },
};
