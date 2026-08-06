import type { Product, StockStatus } from './product.types';

export type { StockStatus };

export interface InventoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  stockStatus?: StockStatus;
  sort?: 'stock_asc' | 'stock_desc' | 'name_asc' | 'name_desc';
}

export interface InventorySummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalStockUnits: number;
}

export type StockAdjustmentType = 'increase' | 'decrease' | 'set';

export interface AdjustStockPayload {
  type: StockAdjustmentType;
  quantity: number;
  reason?: string;
}

export type InventoryProduct = Product;
