import { formatCurrency } from '@/utils/format';

interface OrderTotalsProps {
  subtotal: number;
  discount?: number;
  shippingFee: number;
  tax?: number;
  total: number;
  couponCode?: string;
}

export function OrderTotals({ subtotal, discount = 0, shippingFee, tax = 0, total, couponCode }: OrderTotalsProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-surface-border pt-4 text-sm">
      <div className="flex items-center justify-between text-text-secondary">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between text-semantic-success">
          <span>Discount{couponCode ? ` (${couponCode})` : ''}</span>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-text-secondary">
        <span>Shipping</span>
        <span>{shippingFee > 0 ? formatCurrency(shippingFee) : 'Free'}</span>
      </div>
      <div className="flex items-center justify-between text-text-secondary">
        <span>Tax</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-surface-divider pt-2 text-base font-semibold text-text-primary">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
