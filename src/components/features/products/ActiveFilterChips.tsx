import { X } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { Category } from '@/types/category.types';
import type { ProductQueryParams } from '@/types/product.types';

interface ActiveFilterChipsProps {
  filters: ProductQueryParams;
  categories?: Category[];
  onRemove: (updates: Partial<ProductQueryParams>) => void;
  onClearAll: () => void;
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilterChips({ filters, categories, onRemove, onClearAll }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
      onRemove: () => onRemove({ search: undefined }),
    });
  }

  if (filters.category) {
    const name = categories?.find((c) => c.slug === filters.category)?.name ?? filters.category;
    chips.push({ key: 'category', label: `Category: ${name}`, onRemove: () => onRemove({ category: undefined }) });
  }

  if (filters.brand) {
    chips.push({ key: 'brand', label: `Brand: ${filters.brand}`, onRemove: () => onRemove({ brand: undefined }) });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice !== undefined ? formatCurrency(filters.minPrice) : '₹0';
    const max = filters.maxPrice !== undefined ? formatCurrency(filters.maxPrice) : 'Any';
    chips.push({
      key: 'price',
      label: `Price: ${min} – ${max}`,
      onRemove: () => onRemove({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (filters.rating !== undefined) {
    chips.push({
      key: 'rating',
      label: `${filters.rating}★ & up`,
      onRemove: () => onRemove({ rating: undefined }),
    });
  }

  if (filters.inStock) {
    chips.push({ key: 'inStock', label: 'In stock only', onRemove: () => onRemove({ inStock: undefined }) });
  }

  if (filters.minDiscount !== undefined) {
    chips.push({ key: 'discount', label: 'On sale', onRemove: () => onRemove({ minDiscount: undefined }) });
  }

  if (filters.tags) {
    filters.tags.split(',').filter(Boolean).forEach((tag) => {
      chips.push({
        key: `tag-${tag}`,
        label: `Tag: ${tag}`,
        onRemove: () => {
          const remaining = filters.tags!.split(',').filter((t) => t !== tag);
          onRemove({ tags: remaining.length ? remaining.join(',') : undefined });
        },
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1 text-xs font-medium text-brand-primary hover:opacity-80"
        >
          {chip.label}
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-text-secondary underline hover:text-text-primary"
      >
        Clear all
      </button>
    </div>
  );
}
