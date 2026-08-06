import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-pulse rounded-lg bg-surface-card', className)}
      {...props}
    />
  );
}
