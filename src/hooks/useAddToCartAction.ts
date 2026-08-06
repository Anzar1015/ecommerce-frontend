import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from './useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import type { Product } from '@/types/product.types';

export function useAddToCartAction() {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const add = async (product: Product, quantity = 1) => {
    setIsAdding(true);
    const result = await dispatch(
      addToCart({
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url,
          price: product.price,
          discount: product.discount,
          finalPrice: product.finalPrice,
          stock: product.stock,
        },
        quantity,
      })
    );
    setIsAdding(false);

    if (result.meta.requestStatus === 'rejected') {
      toast.error((result.payload as string) ?? 'Could not add to cart');
      return false;
    }
    toast.success('Added to cart');
    return true;
  };

  return { add, isAdding };
}
