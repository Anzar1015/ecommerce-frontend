import { describe, expect, it } from 'vitest';
import { reviewFormSchema } from './reviewValidation';

const baseValid = { rating: 5, title: 'Great product', comment: 'Really happy with this purchase overall.' };

describe('reviewFormSchema', () => {
  it('accepts a valid review', () => {
    expect(reviewFormSchema.safeParse(baseValid).success).toBe(true);
  });

  it('rejects a rating of 0', () => {
    expect(reviewFormSchema.safeParse({ ...baseValid, rating: 0 }).success).toBe(false);
  });

  it('rejects a rating above 5', () => {
    expect(reviewFormSchema.safeParse({ ...baseValid, rating: 6 }).success).toBe(false);
  });

  it('rejects a title shorter than 3 characters', () => {
    expect(reviewFormSchema.safeParse({ ...baseValid, title: 'Hi' }).success).toBe(false);
  });

  it('rejects a comment shorter than 10 characters', () => {
    expect(reviewFormSchema.safeParse({ ...baseValid, comment: 'Too short' }).success).toBe(false);
  });
});
