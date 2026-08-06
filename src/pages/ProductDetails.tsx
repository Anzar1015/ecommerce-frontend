import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImageOff, Minus, Plus } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Rating } from '@/components/ui/Rating';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/features/cart/AddToCartButton';
import { WishlistButton } from '@/components/features/wishlist/WishlistButton';
import { useProduct } from '@/hooks/useProduct';
import { cn } from '@/utils/cn';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState title="Product not found" description="This product may have been removed." onRetry={() => refetch()} />
      </div>
    );
  }

  const categoryName = typeof product.category === 'string' ? undefined : product.category.name;
  const categorySlug = typeof product.category === 'string' ? undefined : product.category.slug;
  const image = product.images[activeImage];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: 'Shop', to: '/shop' },
          ...(categoryName ? [{ label: categoryName, to: `/shop?category=${categorySlug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-surface-card">
            {image ? (
              <img src={image.url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ImageOff className="h-10 w-10" aria-hidden="true" />
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={img.publicId}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    'h-16 w-16 overflow-hidden rounded-lg border-2',
                    index === activeImage ? 'border-brand-primary' : 'border-transparent'
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              {categoryName && <span className="text-sm text-text-muted">{categoryName}</span>}
              <h1 className="text-2xl font-semibold text-text-primary">{product.name}</h1>
            </div>
            <WishlistButton productId={product.id} />
          </div>

          <Rating value={product.ratings.average} count={product.ratings.count} size="md" />
          <PriceTag price={product.price} discount={product.discount} finalPrice={product.finalPrice} size="lg" />

          <div className="flex items-center gap-2">
            <Badge variant={product.inStock ? 'success' : 'error'}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </Badge>
            {product.stockStatus === 'low_stock' && (
              <Badge variant="warning">Only {product.stock} left!</Badge>
            )}
            {product.brand && <Badge variant="default">{product.brand}</Badge>}
          </div>

          <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>

          <dl className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
            <dt className="font-medium text-text-primary">SKU</dt>
            <dd>{product.sku}</dd>
          </dl>

          {product.inStock && (
            <div className="flex items-center gap-1 self-start rounded-lg border border-surface-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-text-secondary hover:bg-surface-card"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center text-sm text-text-primary">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-text-secondary hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <AddToCartButton product={product} quantity={quantity} className="mt-2 w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}
