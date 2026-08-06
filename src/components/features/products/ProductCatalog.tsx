import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Pagination } from '@/components/common/Pagination';
import { ErrorState } from '@/components/common/ErrorState';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { ProductQueryParams, ProductSort } from '@/types/product.types';

interface ProductCatalogProps {
  title: string;
  breadcrumbLabel: string;
  /** When set, the search term is fixed (e.g. from a global search) and hidden from the filter panel. */
  searchOverride?: string;
}

export function ProductCatalog({ title, breadcrumbLabel, searchOverride }: ProductCatalogProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: DEFAULT_PAGE_SIZE,
    category: searchParams.get('category') ?? undefined,
    sort: (searchParams.get('sort') as ProductSort) ?? 'newest',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    search: searchOverride ?? undefined,
  };

  const { data, isLoading, isError, refetch } = useProducts(filters);

  const updateFilters = (updates: Partial<ProductQueryParams>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: breadcrumbLabel }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">{title}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <ProductFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />

        <div className="flex flex-col gap-6">
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              <ProductGrid products={data?.products ?? []} isLoading={isLoading} />
              {data && (
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={(page) => updateFilters({ page })}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
