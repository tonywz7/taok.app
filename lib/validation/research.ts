import { z } from 'zod';

export const createResearchSessionSchema = z.object({
  project_id: z.string().min(1),
  query: z.string().min(1).max(5000),
});

export const updateResearchSessionSchema = z.object({
  status: z.enum(['draft', 'running', 'completed', 'archived']).optional(),
  query: z.string().min(1).max(5000).optional(),
});

export type CreateResearchSessionInput = z.infer<typeof createResearchSessionSchema>;
export type UpdateResearchSessionInput = z.infer<typeof updateResearchSessionSchema>;
