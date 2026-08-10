import { Star } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { PRODUCT_SORT_OPTIONS, RATING_FILTER_OPTIONS } from '@/constants';
import { cn } from '@/utils/cn';
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

      <Input
        label="Brand"
        placeholder="e.g. Apple"
        value={filters.brand ?? ''}
        onChange={(event) => onChange({ brand: event.target.value || undefined, page: 1 })}
      />

      <Select
        label="Sort by"
        value={filters.sort ?? 'newest'}
        onChange={(event) => onChange({ sort: event.target.value as ProductSort, page: 1 })}
        options={PRODUCT_SORT_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price (₹)"
          type="number"
          min={0}
          value={filters.minPrice ?? ''}
          onChange={(event) =>
            onChange({ minPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })
          }
        />
        <Input
          label="Max price (₹)"
          type="number"
          min={0}
          value={filters.maxPrice ?? ''}
          onChange={(event) =>
            onChange({ maxPrice: event.target.value ? Number(event.target.value) : undefined, page: 1 })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-primary">Minimum rating</span>
        <div className="flex flex-wrap gap-2">
          {RATING_FILTER_OPTIONS.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ rating: filters.rating === rating ? undefined : rating, page: 1 })}
              aria-pressed={filters.rating === rating}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                filters.rating === rating
                  ? 'border-brand-primary bg-brand-accent text-brand-primary'
                  : 'border-surface-border text-text-secondary hover:bg-surface-card'
              )}
            >
              {rating}
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              &amp; up
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Tags"
        placeholder="e.g. summer, sale"
        value={filters.tags ?? ''}
        onChange={(event) => onChange({ tags: event.target.value || undefined, page: 1 })}
      />

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={filters.inStock ?? false}
          onChange={(event) => onChange({ inStock: event.target.checked || undefined, page: 1 })}
          className="h-4 w-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
        />
        In stock only
      </label>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={(filters.minDiscount ?? 0) > 0}
          onChange={(event) => onChange({ minDiscount: event.target.checked ? 1 : undefined, page: 1 })}
          className="h-4 w-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
        />
        On sale only
      </label>
    </div>
  );
}
