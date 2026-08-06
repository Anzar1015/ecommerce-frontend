import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().max(2000).optional(),
  isActive: z.boolean().optional(),
  image: z.instanceof(FileList).optional(),
});

export type CategoryFormSchemaValues = z.infer<typeof categoryFormSchema>;
