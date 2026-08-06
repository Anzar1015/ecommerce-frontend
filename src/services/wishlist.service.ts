import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Wishlist } from '@/types/wishlist.types';
import type { CartApiResponse } from '@/types/cart.types';

export const wishlistApi = {
  async get(): Promise<Wishlist> {
    const { data } = await api.get<ApiSuccessResponse<{ wishlist: Wishlist }>>('/wishlist');
    return data.data.wishlist;
  },

  async add(productId: string): Promise<Wishlist> {
    const { data } = await api.post<ApiSuccessResponse<{ wishlist: Wishlist }>>(`/wishlist/${productId}`);
    return data.data.wishlist;
  },

  async remove(productId: string): Promise<Wishlist> {
    const { data } = await api.delete<ApiSuccessResponse<{ wishlist: Wishlist }>>(
      `/wishlist/${productId}`
    );
    return data.data.wishlist;
  },

  async moveToCart(productId: string, quantity = 1): Promise<CartApiResponse> {
    const { data } = await api.post<ApiSuccessResponse<CartApiResponse>>(
      `/wishlist/${productId}/move-to-cart`,
      { quantity }
    );
    return data.data;
  },
};
