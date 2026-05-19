import { z } from 'zod';

export const leadStatusSchema = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
export const leadSourceSchema = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  email: z.string().trim().email('Please enter a valid email address'),
  status: leadStatusSchema,
  source: leadSourceSchema
});

export const updateLeadSchema = createLeadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided'
  }
);

export const leadListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).optional(),
  status: leadStatusSchema.optional(),
  source: leadSourceSchema.optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['latest', 'oldest']).optional()
});
