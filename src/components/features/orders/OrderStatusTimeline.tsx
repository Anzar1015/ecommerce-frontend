import { Check, X } from 'lucide-react';
import { ORDER_STATUS_SEQUENCE, ORDER_STATUS_LABELS } from '@/constants';
import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types/order.types';

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-semantic-error/10 px-4 py-3 text-sm font-medium text-semantic-error">
        <X className="h-4 w-4" aria-hidden="true" />
        This order was cancelled
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status as (typeof ORDER_STATUS_SEQUENCE)[number]);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-4">
      {ORDER_STATUS_SEQUENCE.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === ORDER_STATUS_SEQUENCE.length - 1;
        return (
          <li key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  isComplete
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-surface-border text-text-muted'
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn('text-sm font-medium', isComplete ? 'text-text-primary' : 'text-text-muted')}>
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <span className={cn('h-0.5 w-8', isComplete ? 'bg-brand-primary' : 'bg-surface-border')} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
