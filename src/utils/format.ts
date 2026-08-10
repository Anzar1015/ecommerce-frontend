import { CURRENCY } from '@/constants';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: CURRENCY,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
