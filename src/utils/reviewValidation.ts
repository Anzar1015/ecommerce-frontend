import { z } from 'zod';

export const reviewFormSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Please select a rating').max(5),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
  comment: z.string().trim().min(10, 'Comment must be at least 10 characters').max(2000),
  images: z.instanceof(FileList).optional(),
});

export type ReviewFormSchemaValues = z.infer<typeof reviewFormSchema>;
