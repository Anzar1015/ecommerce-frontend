import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addressApi } from '@/services/address.service';
import { extractErrorMessage } from '@/utils/errors';
import { addressKeys } from './useAddresses';
import type { AddressFormValues } from '@/types/address.types';

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: AddressFormValues) => addressApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address added');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateAddress(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<AddressFormValues>) => addressApi.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address updated');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success('Address removed');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
