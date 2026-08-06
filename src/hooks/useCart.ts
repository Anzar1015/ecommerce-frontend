import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { updateCartItemQuantity, removeFromCart, fetchCart } from '@/store/slices/cartSlice';

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, summary, status, error } = useAppSelector((state) => state.cart);

  const updateQuantity = async (productId: string, quantity: number) => {
    const result = await dispatch(updateCartItemQuantity({ productId, quantity }));
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string) ?? 'Could not update cart');
    }
  };

  const removeItem = async (productId: string) => {
    const result = await dispatch(removeFromCart(productId));
    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string) ?? 'Could not remove item');
    }
  };

  return {
    items,
    summary,
    isLoading: status === 'loading',
    error,
    updateQuantity,
    removeItem,
    refresh: () => dispatch(fetchCart()),
  };
}
