import { api } from './api';
import { buildFormData } from '@/utils/buildFormData';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { Category, CategoryFormValues } from '@/types/category.types';

export const categoryApi = {
  async list(): Promise<Category[]> {
    const { data } = await api.get<ApiSuccessResponse<{ categories: Category[] }>>('/categories');
    return data.data.categories;
  },

  async getByIdentifier(identifier: string): Promise<Category> {
    const { data } = await api.get<ApiSuccessResponse<{ category: Category }>>(
      `/categories/${identifier}`
    );
    return data.data.category;
  },

  async create(values: CategoryFormValues): Promise<Category> {
    const { data } = await api.post<ApiSuccessResponse<{ category: Category }>>(
      '/categories',
      buildFormData(values),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.category;
  },

  async update(id: string, values: Partial<CategoryFormValues>): Promise<Category> {
    const { data } = await api.patch<ApiSuccessResponse<{ category: Category }>>(
      `/categories/${id}`,
      buildFormData(values),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data.category;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
