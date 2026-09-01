import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<StarRatingInputProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/** Click-to-rate star input, distinct from the read-only `Rating` display component. */
export function StarRatingInput({ value, onChange, size = 'lg' }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Star
            className={cn(
              sizeStyles[size],
              star <= displayValue ? 'fill-semantic-warning text-semantic-warning' : 'text-surface-border'
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
