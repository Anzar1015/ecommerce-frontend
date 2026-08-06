import { z } from 'zod';

export const addressFormSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().trim().min(7, 'Enter a valid phone number').max(20),
  addressLine1: z.string().trim().min(3, 'Address is required').max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, 'City is required').max(100),
  state: z.string().trim().min(1, 'State is required').max(100),
  postalCode: z.string().trim().min(1, 'Postal code is required').max(20),
  country: z.string().trim().min(1, 'Country is required').max(100),
  isDefault: z.boolean().optional(),
});

export type AddressFormSchemaValues = z.infer<typeof addressFormSchema>;
