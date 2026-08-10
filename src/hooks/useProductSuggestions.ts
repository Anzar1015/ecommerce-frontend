import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productApi } from '@/services/product.service';
import { useDebounce } from './useDebounce';

const MIN_QUERY_LENGTH = 2;

export const productSuggestionKeys = {
  all: ['products', 'suggestions'] as const,
  query: (q: string) => [...productSuggestionKeys.all, q] as const,
};

/** Debounces `rawQuery` and fetches autocomplete suggestions once it's long enough. */
export function useProductSuggestions(rawQuery: string) {
  const query = useDebounce(rawQuery.trim(), 250);
  const enabled = query.length >= MIN_QUERY_LENGTH;

  return useQuery({
    queryKey: productSuggestionKeys.query(query),
    queryFn: () => productApi.suggest(query),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}
