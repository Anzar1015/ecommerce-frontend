import { z } from 'zod';

export const couponFormSchema = z
  .object({
    code: z.string().trim().min(3, 'Code must be at least 3 characters').max(30),
    description: z.string().trim().max(500).optional(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    value: z.coerce.number().positive('Value must be greater than 0'),
    minimumOrderAmount: z.coerce.number().min(0).default(0),
    maximumDiscount: z.coerce.number().min(0).optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    usageLimit: z.coerce.number().int().positive().optional(),
    perUserLimit: z.coerce.number().int().positive().optional(),
    firstOrderOnly: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'PERCENTAGE' && data.value > 100) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cannot exceed 100%', path: ['value'] });
    }
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after the start date',
        path: ['endDate'],
      });
    }
  });

export type CouponFormSchemaValues = z.infer<typeof couponFormSchema>;
