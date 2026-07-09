import { z } from 'zod';

const urlSchema = z.string().url().optional().or(z.literal(''));
const emailSchema = z.string().email().optional().or(z.literal(''));

export const createPersonSchema = z.object({
  company_id: z.string().min(1),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  title: z.string().max(255).optional(),
  seniority: z.enum(['c_level', 'vp', 'director', 'manager', 'ic', 'founder', 'other']).optional(),
  department: z.string().max(255).optional(),
  linkedin_url: urlSchema,
  email: emailSchema,
});

export const updatePersonSchema = createPersonSchema.omit({ company_id: true }).partial();

export const searchPeopleSchema = z.object({
  company_id: z.string().optional(),
  query: z.string().optional(),
  seniority: z.enum(['c_level', 'vp', 'director', 'manager', 'ic', 'founder', 'other']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type SearchPeopleInput = z.infer<typeof searchPeopleSchema>;
