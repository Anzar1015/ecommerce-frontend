import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { ShippingMethodsResult } from '@/types/shipping.types';

export const shippingApi = {
  async listMethods(subtotal?: number): Promise<ShippingMethodsResult> {
    const { data } = await api.get<ApiSuccessResponse<ShippingMethodsResult>>('/shipping/methods', {
      params: subtotal !== undefined ? { subtotal } : undefined,
    });
    return data.data;
  },
};
