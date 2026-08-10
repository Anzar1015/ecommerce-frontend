import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Pagination } from '@/components/common/Pagination';
import { ErrorState } from '@/components/common/ErrorState';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import { ProductSearchBar } from './ProductSearchBar';
import { ActiveFilterChips } from './ActiveFilterChips';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { ProductQueryParams, ProductSort } from '@/types/product.types';

interface ProductCatalogProps {
  title: string;
  breadcrumbLabel: string;
}

export function ProductCatalog({ title, breadcrumbLabel }: ProductCatalogProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { data: categories } = useCategories();

  const filters: ProductQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: DEFAULT_PAGE_SIZE,
    category: searchParams.get('category') ?? undefined,
    brand: searchParams.get('brand') ?? undefined,
    tags: searchParams.get('tags') ?? undefined,
    sort: (searchParams.get('sort') as ProductSort) ?? 'newest',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    minDiscount: searchParams.get('minDiscount') ? Number(searchParams.get('minDiscount')) : undefined,
    search: searchParams.get('search') ?? undefined,
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

  const total = data?.pagination.total ?? 0;
  const rangeStart = total === 0 ? 0 : (filters.page! - 1) * DEFAULT_PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page! * DEFAULT_PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: breadcrumbLabel }]} />
      <h1 className="mt-2 text-2xl font-semibold text-text-primary">{title}</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ProductSearchBar
          value={filters.search}
          onSearch={(search) => updateFilters({ search: search || undefined, page: 1 })}
          className="sm:max-w-md"
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </Button>
      </div>

      <div className="mt-4">
        <ActiveFilterChips
          filters={filters}
          categories={categories}
          onRemove={updateFilters}
          onClearAll={clearFilters}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <ProductFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
        </div>

        <div className="flex flex-col gap-4">
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              {!isLoading && (
                <p className="text-sm text-text-secondary">
                  {total === 0 ? 'No products found' : `Showing ${rangeStart}–${rangeEnd} of ${total} products`}
                </p>
              )}
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

      <Drawer isOpen={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} title="Filters">
        <ProductFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />
      </Drawer>
    </div>
  );
}
