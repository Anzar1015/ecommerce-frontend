import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { CartApiResponse, GuestCartItem } from '@/types/cart.types';

export const cartApi = {
  async getCart(): Promise<CartApiResponse> {
    const { data } = await api.get<ApiSuccessResponse<CartApiResponse>>('/cart');
    return data.data;
  },

  async addItem(productId: string, quantity: number): Promise<CartApiResponse> {
    const { data } = await api.post<ApiSuccessResponse<CartApiResponse>>('/cart/items', {
      productId,
      quantity,
    });
    return data.data;
  },

  async updateItem(productId: string, quantity: number): Promise<CartApiResponse> {
    const { data } = await api.patch<ApiSuccessResponse<CartApiResponse>>(
      `/cart/items/${productId}`,
      { quantity }
    );
    return data.data;
  },

  async removeItem(productId: string): Promise<CartApiResponse> {
    const { data } = await api.delete<ApiSuccessResponse<CartApiResponse>>(`/cart/items/${productId}`);
    return data.data;
  },

  async merge(items: GuestCartItem[]): Promise<CartApiResponse> {
    const { data } = await api.post<ApiSuccessResponse<CartApiResponse>>('/cart/merge', {
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
    return data.data;
  },
};
