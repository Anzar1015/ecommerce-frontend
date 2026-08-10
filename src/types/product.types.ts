import type { Category } from './category.types';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

export type ProductSort =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'rating'
  | 'popularity';

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: ProductImage[];
  category: Category | string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  inStock: boolean;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  sku: string;
  brand?: string;
  tags: string[];
  status: ProductStatus;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  tag?: string;
  /** Comma-separated tag list (matches any), e.g. "summer,sale". */
  tags?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  minDiscount?: number;
  status?: ProductStatus;
  sort?: ProductSort;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  brand?: string;
  tags?: string;
  status: ProductStatus;
  images?: FileList;
}
