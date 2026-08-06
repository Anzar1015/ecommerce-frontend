import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ImageOff, ShoppingCart } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
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

          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.discount > 0 && <Badge variant="success">-{product.discount}%</Badge>}
            {!product.inStock && <Badge variant="error">Out of stock</Badge>}
          </div>

          <WishlistButton productId={product.id} className="absolute right-2 top-2" />

          <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-text-secondary shadow-soft hover:text-brand-primary"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>

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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary shadow-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
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

      <Modal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} title={product.name} size="lg">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-card">
            {image ? (
              <img src={image.url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ImageOff className="h-10 w-10" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {categoryName && <span className="text-xs text-text-muted">{categoryName}</span>}
            <Rating value={product.ratings.average} count={product.ratings.count} />
            <PriceTag price={product.price} discount={product.discount} finalPrice={product.finalPrice} size="lg" />
            <p className="line-clamp-4 text-sm text-text-secondary">{product.description}</p>
            {!product.inStock && <Badge variant="error">Out of stock</Badge>}

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button
                onClick={() => add(product)}
                isLoading={isAdding}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Add to cart
              </Button>
              <Link
                to={`/products/${product.slug}`}
                onClick={() => setIsQuickViewOpen(false)}
                className="text-center text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
