import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/services/address.service';

export const addressKeys = {
  all: ['addresses'] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: addressApi.list,
  });
}
