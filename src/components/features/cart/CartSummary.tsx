import { formatCurrency } from '@/utils/format';
import type { CartSummary as CartSummaryType } from '@/types/cart.types';

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Items ({summary.totalQuantity})</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-base font-semibold text-text-primary">
        <span>Subtotal</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      <p className="text-xs text-text-muted">Shipping and taxes calculated at checkout.</p>
    </div>
  );
}
