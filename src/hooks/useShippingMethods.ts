import { useQuery } from '@tanstack/react-query';
import { shippingApi } from '@/services/shipping.service';

export function useShippingMethods(subtotal?: number) {
  return useQuery({
    queryKey: ['shipping', 'methods', subtotal],
    queryFn: () => shippingApi.listMethods(subtotal),
  });
}
