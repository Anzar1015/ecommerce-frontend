import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  discount: z.coerce.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  stock: z.coerce.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.coerce
    .number()
    .int('Threshold must be a whole number')
    .min(0, 'Threshold cannot be negative'),
  sku: z.string().trim().min(1, 'SKU is required'),
  brand: z.string().trim().max(100).optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']),
  images: z.instanceof(FileList).optional(),
});

export type ProductFormSchemaValues = z.infer<typeof productFormSchema>;
