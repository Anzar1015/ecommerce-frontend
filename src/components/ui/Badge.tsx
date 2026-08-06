import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-surface-card text-text-secondary',
  success: 'bg-semantic-success/10 text-semantic-success',
  warning: 'bg-semantic-warning/10 text-semantic-warning',
  error: 'bg-semantic-error/10 text-semantic-error',
  info: 'bg-semantic-info/10 text-semantic-info',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
