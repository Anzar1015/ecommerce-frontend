import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/services/category.service';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (identifier: string) => [...categoryKeys.all, 'detail', identifier] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoryApi.list,
  });
}

export function useCategory(identifier: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(identifier ?? ''),
    queryFn: () => categoryApi.getByIdentifier(identifier as string),
    enabled: !!identifier,
  });
}
