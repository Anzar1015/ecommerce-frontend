import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/product.service';
import { productKeys } from './useProducts';

export function useProduct(identifier: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(identifier ?? ''),
    queryFn: () => productApi.getByIdentifier(identifier as string),
    enabled: !!identifier,
  });
}
