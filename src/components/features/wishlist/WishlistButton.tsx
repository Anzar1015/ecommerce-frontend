import { MouseEvent } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlistMutations';
import { cn } from '@/utils/cn';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  if (!isAuthenticated) return null;

  const isInWishlist = wishlist?.products.some((product) => product.id === productId) ?? false;

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isInWishlist) removeFromWishlist.mutate(productId);
    else addToWishlist.mutate(productId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isInWishlist}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-secondary shadow-soft transition-colors hover:text-semantic-error',
        isInWishlist && 'text-semantic-error',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', isInWishlist && 'fill-semantic-error')} aria-hidden="true" />
    </button>
  );
}
