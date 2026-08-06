import { Heart } from 'lucide-react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { WishlistCard } from '@/components/features/wishlist/WishlistCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useRemoveFromWishlist, useMoveWishlistItemToCart } from '@/hooks/useWishlistMutations';

export default function Wishlist() {
  const { data: wishlist, isLoading, isError, refetch } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const moveToCart = useMoveWishlistItemToCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">My Wishlist</h1>

      <div className="mt-6">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))}
          </div>
        ) : wishlist && wishlist.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.products.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={() => removeFromWishlist.mutate(product.id)}
                onMoveToCart={() => moveToCart.mutate({ productId: product.id })}
                isMoving={moveToCart.isPending && moveToCart.variables?.productId === product.id}
                isRemoving={removeFromWishlist.isPending && removeFromWishlist.variables === product.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="h-6 w-6" aria-hidden="true" />}
            title="Your wishlist is empty"
            description="Save items you love to buy them later."
          />
        )}
      </div>
    </div>
  );
}
