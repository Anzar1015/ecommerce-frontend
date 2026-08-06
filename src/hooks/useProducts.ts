import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productApi } from '@/services/product.service';
import type { ProductQueryParams } from '@/types/product.types';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductQueryParams) => [...productKeys.all, 'list', params] as const,
  detail: (identifier: string) => [...productKeys.all, 'detail', identifier] as const,
};

/** Lists products with pagination/filter/sort. Keeps the previous page
 * visible while the next one loads, so grids don't flash empty on paging. */
export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.list(params),
    placeholderData: keepPreviousData,
  });
}
