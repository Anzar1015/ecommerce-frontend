import { api } from './api';
import { buildFormData } from '@/utils/buildFormData';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type { Product, ProductFormValues, ProductQueryParams } from '@/types/product.types';

interface ProductListResult {
  products: Product[];
  pagination: PaginationMeta;
}

export const productApi = {
  async list(params: ProductQueryParams): Promise<ProductListResult> {
    const { data } = await api.get<ApiSuccessResponse<ProductListResult>>('/products', { params });
    return data.data;
  },

  async getByIdentifier(identifier: string): Promise<Product> {
    const { data } = await api.get<ApiSuccessResponse<{ product: Product }>>(
      `/products/${identifier}`
    );
    return data.data.product;
  },

  async create(values: ProductFormValues): Promise<Product> {
    const { data } = await api.post<ApiSuccessResponse<{ product: Product }>>(
      '/products',
      buildFormData(values),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.product;
  },

  async update(id: string, values: Partial<ProductFormValues>): Promise<Product> {
    const { data } = await api.patch<ApiSuccessResponse<{ product: Product }>>(
      `/products/${id}`,
      buildFormData(values),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.product;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async removeImage(id: string, publicId: string): Promise<Product> {
    const { data } = await api.delete<ApiSuccessResponse<{ product: Product }>>(
      `/products/${id}/images`,
      { data: { publicId } }
    );
    return data.data.product;
  },
};
