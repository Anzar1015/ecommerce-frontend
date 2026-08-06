import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/features/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';

export function BestSellersSection() {
  const { data, isLoading, isError, refetch } = useProducts({
    limit: 10,
    sort: 'rating',
    status: 'active',
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === 'left' ? -node.clientWidth * 0.8 : node.clientWidth * 0.8, behavior: 'smooth' });
  };

  const products = data?.products ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">Best Sellers</h2>
          <p className="mt-1 text-sm text-text-secondary">Customer favorites, trending right now.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop?sort=rating"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-text-secondary hover:bg-surface-card"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-text-secondary hover:bg-surface-card"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isError && <ErrorState description="We couldn't load best sellers." onRetry={() => refetch()} />}

        {isLoading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex w-48 flex-shrink-0 flex-col gap-3 sm:w-56">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <EmptyState title="No best sellers yet" description="Check back soon for trending products." />
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div key={product.id} className="w-48 flex-shrink-0 snap-start sm:w-56">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
