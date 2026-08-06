import { z } from 'zod';

export const adjustStockFormSchema = z.object({
  type: z.enum(['increase', 'decrease', 'set']),
  quantity: z.coerce.number().int('Must be a whole number').min(0, 'Cannot be negative'),
  reason: z.string().trim().max(500).optional(),
});

export type AdjustStockFormValues = z.infer<typeof adjustStockFormSchema>;
