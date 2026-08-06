import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/features/products/ProductGrid';
import { ErrorState } from '@/components/common/ErrorState';

export function FeaturedProductsSection() {
  const { data, isLoading, isError, refetch } = useProducts({
    limit: 8,
    sort: 'newest',
    status: 'active',
  });

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">Featured Products</h2>
            <p className="mt-1 text-sm text-text-secondary">Fresh picks, handpicked for you.</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8">
          {isError ? (
            <ErrorState description="We couldn't load featured products." onRetry={() => refetch()} />
          ) : (
            <ProductGrid products={data?.products ?? []} isLoading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
}
