import { describe, expect, it } from 'vitest';
import { formatCurrency } from './format';
import { CURRENCY } from '@/constants';

describe('formatCurrency', () => {
  it('uses INR, not USD', () => {
    expect(CURRENCY).toBe('INR');
  });

  it('formats whole rupee amounts with the ₹ symbol and Indian digit grouping', () => {
    expect(formatCurrency(1299)).toBe('₹1,299.00');
    expect(formatCurrency(10000)).toBe('₹10,000.00');
    expect(formatCurrency(499)).toBe('₹499.00');
  });

  it('never renders a dollar sign', () => {
    expect(formatCurrency(1299)).not.toContain('$');
  });

  it('formats zero and decimal amounts correctly', () => {
    expect(formatCurrency(0)).toBe('₹0.00');
    expect(formatCurrency(1234.5)).toBe('₹1,234.50');
  });
});
