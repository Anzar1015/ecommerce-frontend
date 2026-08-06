import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push('ellipsis');
    result.push(p);
  });
  return result;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-text-secondary hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {getPageNumbers(page, totalPages).map((entry, index) =>
        entry === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
              entry === page
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:bg-surface-card'
            )}
          >
            {entry}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-text-secondary hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
