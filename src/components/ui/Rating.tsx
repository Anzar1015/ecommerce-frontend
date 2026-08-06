import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeStyles: Record<NonNullable<RatingProps['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
};

export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} role="img" aria-label={`Rated ${value} out of 5`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              sizeStyles[size],
              index < Math.round(value) ? 'fill-semantic-warning text-semantic-warning' : 'text-surface-border'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-text-muted">({count})</span>
      )}
    </div>
  );
}
