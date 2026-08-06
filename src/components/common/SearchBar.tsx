import { FormEvent, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ defaultValue = '', placeholder = 'Search products…', onSearch, className }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => setValue(defaultValue), [defaultValue]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className={cn(
          'h-11 w-full rounded-lg border border-surface-border bg-white pl-10 pr-4 text-sm text-text-primary',
          'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
          'transition-colors'
        )}
      />
    </form>
  );
}
