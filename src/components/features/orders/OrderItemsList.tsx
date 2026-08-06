import { ImageOff } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { OrderItem } from '@/types/order.types';

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="divide-y divide-surface-divider rounded-xl border border-surface-border bg-white">
      {items.map((item) => (
        <div key={`${item.product}-${item.sku}`} className="flex items-center gap-4 p-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-card">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <ImageOff className="h-5 w-5" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{item.name}</p>
            <p className="text-xs text-text-muted">SKU: {item.sku}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {formatCurrency(item.price)} &times; {item.quantity}
            </p>
          </div>
          <p className="text-sm font-semibold text-text-primary">{formatCurrency(item.subtotal)}</p>
        </div>
      ))}
    </div>
  );
}
