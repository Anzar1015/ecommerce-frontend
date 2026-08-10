import { describe, expect, it } from 'vitest';
import { couponFormSchema } from './couponValidation';

const baseValid = {
  code: 'SAVE10',
  type: 'PERCENTAGE' as const,
  value: 10,
  minimumOrderAmount: 0,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  firstOrderOnly: false,
  isActive: true,
};

describe('couponFormSchema', () => {
  it('accepts a valid percentage coupon', () => {
    expect(couponFormSchema.safeParse(baseValid).success).toBe(true);
  });

  it('rejects a percentage value over 100', () => {
    const result = couponFormSchema.safeParse({ ...baseValid, value: 150 });
    expect(result.success).toBe(false);
  });

  it('accepts a fixed-amount value over 100 (no percentage cap applies)', () => {
    const result = couponFormSchema.safeParse({ ...baseValid, type: 'FIXED_AMOUNT', value: 500 });
    expect(result.success).toBe(true);
  });

  it('rejects an end date before the start date', () => {
    const result = couponFormSchema.safeParse({ ...baseValid, startDate: '2026-12-31', endDate: '2026-01-01' });
    expect(result.success).toBe(false);
  });

  it('rejects a code shorter than 3 characters', () => {
    const result = couponFormSchema.safeParse({ ...baseValid, code: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects a non-positive value', () => {
    const result = couponFormSchema.safeParse({ ...baseValid, value: 0 });
    expect(result.success).toBe(false);
  });
});
