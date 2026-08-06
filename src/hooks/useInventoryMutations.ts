import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inventoryApi } from '@/services/inventory.service';
import { extractErrorMessage } from '@/utils/errors';
import { inventoryKeys } from './useInventory';
import { productKeys } from './useProducts';
import type { AdjustStockPayload } from '@/types/inventory.types';

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: AdjustStockPayload }) =>
      inventoryApi.adjustStock(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Stock adjusted successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
