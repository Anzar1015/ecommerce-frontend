import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface PriceTagProps {
  price: number;
  discount?: number;
  finalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function PriceTag({ price, discount = 0, finalPrice, size = 'md', className }: PriceTagProps) {
  const computedFinalPrice = finalPrice ?? Math.round(price * (1 - discount / 100) * 100) / 100;
  const hasDiscount = discount > 0 && computedFinalPrice < price;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-text-primary', sizeStyles[size])}>
        {formatCurrency(computedFinalPrice)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-text-muted line-through">{formatCurrency(price)}</span>
          <span className="text-xs font-medium text-semantic-success">-{discount}%</span>
        </>
      )}
    </div>
  );
}
