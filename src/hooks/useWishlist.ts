import { useQuery } from '@tanstack/react-query';
import { wishlistApi } from '@/services/wishlist.service';

export const wishlistKeys = {
  all: ['wishlist'] as const,
};

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: wishlistApi.get,
  });
}
