import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart, Trash2 } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from '@/components/ui/PriceTag';
import { Button } from '@/components/ui/Button';
import type { WishlistProduct } from '@/types/wishlist.types';

interface WishlistCardProps {
  product: WishlistProduct;
  onRemove: () => void;
  onMoveToCart: () => void;
  isMoving?: boolean;
  isRemoving?: boolean;
}

export function WishlistCard({ product, onRemove, onMoveToCart, isMoving, isRemoving }: WishlistCardProps) {
  const image = product.images[0];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-surface-border bg-white">
      <Link to={`/products/${product.slug}`} className="aspect-square overflow-hidden bg-surface-card">
        {image ? (
          <img src={image.url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link
          to={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-text-primary hover:text-brand-primary"
        >
          {product.name}
        </Link>
        <Rating value={product.ratings.average} count={product.ratings.count} />
        <PriceTag price={product.price} discount={product.discount} finalPrice={product.finalPrice} size="sm" />

        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            onClick={onMoveToCart}
            isLoading={isMoving}
            disabled={product.stock === 0}
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {product.stock === 0 ? 'Out of stock' : 'Move to cart'}
          </Button>
          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoving}
            aria-label={`Remove ${product.name} from wishlist`}
            className="rounded-lg p-2 text-semantic-error hover:bg-semantic-error/10 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
