import { z } from 'zod';

const urlSchema = z.string().url().optional().or(z.literal(''));

export const createCompanySchema = z.object({
  legal_name: z.string().min(1).max(255),
  display_name: z.string().min(1).max(255),
  domain: z.string().max(255).optional(),
  website: urlSchema,
  linkedin_url: urlSchema,
  industry: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
  location: z.string().max(255).optional(),
  employee_count: z.number().int().positive().optional(),
  revenue_range: z.string().max(255).optional(),
  funding_stage: z.string().max(255).optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const searchCompaniesSchema = z.object({
  query: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  domain: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type SearchCompaniesInput = z.infer<typeof searchCompaniesSchema>;
