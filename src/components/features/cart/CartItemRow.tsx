import { Link } from 'react-router-dom';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';
import { PriceTag } from '@/components/ui/PriceTag';
import type { CartItem } from '@/types/cart.types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 py-4">
      <Link
        to={`/products/${product.slug}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-card"
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <ImageOff className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-text-primary hover:text-brand-primary"
        >
          {product.name}
        </Link>
        <PriceTag price={product.price} discount={product.discount} finalPrice={product.finalPrice} size="sm" />

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-surface-border">
            <button
              type="button"
              onClick={() => onUpdateQuantity(quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-surface-card"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="w-6 text-center text-sm text-text-primary">{quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-text-secondary hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="rounded-lg p-2 text-semantic-error hover:bg-semantic-error/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
