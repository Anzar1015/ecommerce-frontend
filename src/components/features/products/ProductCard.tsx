import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { WishlistButton } from '@/components/features/wishlist/WishlistButton';
import { useAddToCartAction } from '@/hooks/useAddToCartAction';
import type { Product } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const categoryName = typeof product.category === 'string' ? undefined : product.category.name;
  const { add, isAdding } = useAddToCartAction();

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-surface-border bg-white transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-card">
        {image ? (
          <img
            src={image.url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
        {!product.inStock && (
          <span className="absolute left-2 top-2">
            <Badge variant="error">Out of stock</Badge>
          </span>
        )}

        <WishlistButton productId={product.id} className="absolute right-2 top-2" />

        {product.inStock && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              add(product);
            }}
            disabled={isAdding}
            aria-label="Add to cart"
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary opacity-0 shadow-soft transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {categoryName && <span className="text-xs text-text-muted">{categoryName}</span>}
        <h3 className="line-clamp-2 text-sm font-medium text-text-primary">{product.name}</h3>
        <Rating value={product.ratings.average} count={product.ratings.count} />
        <div className="mt-1">
          <PriceTag price={product.price} discount={product.discount} finalPrice={product.finalPrice} size="sm" />
        </div>
      </div>
    </Link>
  );
}
