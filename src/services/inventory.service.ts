import { api } from './api';
import type { ApiSuccessResponse } from '@/types/auth.types';
import type { PaginationMeta } from '@/types/common.types';
import type { Product } from '@/types/product.types';
import type { AdjustStockPayload, InventoryQueryParams, InventorySummary } from '@/types/inventory.types';

interface InventoryListResult {
  products: Product[];
  pagination: PaginationMeta;
}

export const inventoryApi = {
  async list(params: InventoryQueryParams): Promise<InventoryListResult> {
    const { data } = await api.get<ApiSuccessResponse<InventoryListResult>>('/inventory', { params });
    return data.data;
  },

  async summary(): Promise<InventorySummary> {
    const { data } = await api.get<ApiSuccessResponse<{ summary: InventorySummary }>>('/inventory/summary');
    return data.data.summary;
  },

  async adjustStock(productId: string, payload: AdjustStockPayload): Promise<Product> {
    const { data } = await api.patch<ApiSuccessResponse<{ product: Product }>>(
      `/inventory/${productId}/stock`,
      payload
    );
    return data.data.product;
  },
};
