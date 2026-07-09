import { z } from 'zod';

export const createContactSchema = z.object({
  person_id: z.string().min(1),
  company_id: z.string().min(1),
  status: z.enum(['prospect', 'lead', 'qualified', 'engaged', 'customer', 'archived']).optional(),
  source: z.string().max(255).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateContactSchema = createContactSchema.partial();

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
