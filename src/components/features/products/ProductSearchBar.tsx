import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff, Loader2, Search } from 'lucide-react';
import { useProductSuggestions } from '@/hooks/useProductSuggestions';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ProductSearchBarProps {
  value?: string;
  onSearch: (query: string) => void;
  className?: string;
}

/** Debounced, autocomplete-enabled product search box (spec 11.1/11.6). Typing
 * updates the `search` filter automatically after a short pause — no need to
 * press Enter — and shows a live dropdown of matching products. */
export function ProductSearchBar({ value = '', onSearch, className }: ProductSearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setInputValue(value), [value]);

  const debouncedValue = useDebounce(inputValue, 400);
  useEffect(() => {
    if (debouncedValue !== value) onSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const { data: suggestions, isFetching } = useProductSuggestions(inputValue);
  const showDropdown = isOpen && inputValue.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(inputValue.trim());
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} role="search">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false);
          }}
          placeholder="Search by name, brand, SKU…"
          aria-label="Search products"
          autoComplete="off"
          className={cn(
            'h-11 w-full rounded-lg border border-surface-border bg-white pl-10 pr-4 text-sm text-text-primary',
            'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
            'transition-colors'
          )}
        />
      </form>

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-surface-border bg-white shadow-card">
          {isFetching && !suggestions?.length ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching…
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul role="listbox">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <Link
                    to={`/products/${suggestion.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-card"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-card">
                      {suggestion.image ? (
                        <img src={suggestion.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageOff className="h-4 w-4 text-text-muted" aria-hidden="true" />
                      )}
                    </div>
                    <span className="line-clamp-1 flex-1 text-text-primary">{suggestion.name}</span>
                    <span className="shrink-0 text-text-secondary">{formatCurrency(suggestion.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-text-secondary">No matching products.</p>
          )}
        </div>
      )}
    </div>
  );
}
