import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi } from '@/services/product.service';
import { extractErrorMessage } from '@/utils/errors';
import { productKeys } from './useProducts';
import type { ProductFormValues } from '@/types/product.types';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductFormValues) => productApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product created successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<ProductFormValues>) => productApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product updated successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product deleted successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useRemoveProductImage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (publicId: string) => productApi.removeImage(id, publicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
