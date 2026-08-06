import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistApi } from '@/services/wishlist.service';
import { extractErrorMessage } from '@/utils/errors';
import { wishlistKeys } from './useWishlist';
import { useAppDispatch } from './useAppDispatch';
import { setCartItems, apiItemToCartItem } from '@/store/slices/cartSlice';

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast.success('Added to wishlist');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

/** Moves a wishlist item into the cart in one call, then syncs the Redux
 * cart slice directly from the response (no extra GET /cart round-trip). */
export function useMoveWishlistItemToCart() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      wishlistApi.moveToCart(productId, quantity),
    onSuccess: ({ cart }) => {
      dispatch(setCartItems(cart.items.map(apiItemToCartItem)));
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast.success('Moved to cart');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
