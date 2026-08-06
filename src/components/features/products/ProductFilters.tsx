import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { PRODUCT_SORT_OPTIONS } from '@/constants';
import type { ProductQueryParams, ProductSort } from '@/types/product.types';

interface ProductFiltersProps {
  filters: ProductQueryParams;
  onChange: (updates: Partial<ProductQueryParams>) => void;
  onClear: () => void;
}

export function ProductFilters({ filters, onChange, onClear }: ProductFiltersProps) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <Select
        label="Category"
        placeholder="All categories"
        value={filters.category ?? ''}
        onChange={(event) => onChange({ category: event.target.value || undefined, page: 1 })}
        options={(categories ?? []).map((category) => ({ value: category.slug, label: category.name }))}
      />

      <Select
        label="Sort by"
        value={filters.sort ?? 'newest'}
        onChange={(event) => onChange({ sort: event.target.value as ProductSort, page: 1 })}
        options={PRODUCT_SORT_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price"
          type="number"
          min={0}
          value={filters.minPrice ?? ''}
          onChange={(event) =>
            onChange({ minPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })
          }
        />
        <Input
          label="Max price"
          type="number"
          min={0}
          value={filters.maxPrice ?? ''}
          onChange={(event) =>
            onChange({ maxPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })
          }
        />
      </div>
    </div>
  );
}
