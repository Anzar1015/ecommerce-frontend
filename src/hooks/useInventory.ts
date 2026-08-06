import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { inventoryApi } from '@/services/inventory.service';
import type { InventoryQueryParams } from '@/types/inventory.types';

export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (params: InventoryQueryParams) => [...inventoryKeys.all, 'list', params] as const,
  summary: ['inventory', 'summary'] as const,
};

export function useInventory(params: InventoryQueryParams) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useInventorySummary() {
  return useQuery({
    queryKey: inventoryKeys.summary,
    queryFn: () => inventoryApi.summary(),
  });
}
