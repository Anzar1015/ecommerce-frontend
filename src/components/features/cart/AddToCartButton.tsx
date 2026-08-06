import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAddToCartAction } from '@/hooks/useAddToCartAction';
import type { Product } from '@/types/product.types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const { add, isAdding } = useAddToCartAction();

  return (
    <Button
      onClick={() => add(product, quantity)}
      disabled={!product.inStock}
      isLoading={isAdding}
      className={className}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      {product.inStock ? 'Add to cart' : 'Out of stock'}
    </Button>
  );
}
