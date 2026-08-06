import { formatCurrency } from '@/utils/format';

interface OrderTotalsProps {
  subtotal: number;
  shippingFee: number;
  total: number;
}

export function OrderTotals({ subtotal, shippingFee, total }: OrderTotalsProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-surface-border pt-4 text-sm">
      <div className="flex items-center justify-between text-text-secondary">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-text-secondary">
        <span>Shipping</span>
        <span>{shippingFee > 0 ? formatCurrency(shippingFee) : 'Free'}</span>
      </div>
      <div className="flex items-center justify-between border-t border-surface-divider pt-2 text-base font-semibold text-text-primary">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
