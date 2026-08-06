import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryApi } from '@/services/category.service';
import { extractErrorMessage } from '@/utils/errors';
import { categoryKeys } from './useCategories';
import type { CategoryFormValues } from '@/types/category.types';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CategoryFormValues) => categoryApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category created successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<CategoryFormValues>) => categoryApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category updated successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category deleted successfully');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
