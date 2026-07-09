import { db } from '@/lib/db';
import { researchSessions, messages } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateResearchSessionInput, UpdateResearchSessionInput } from '@/lib/validation';

export async function getResearchSessionById(id: string, organizationId: string) {
  return db.query.researchSessions.findFirst({
    where: and(
      eq(researchSessions.id, id),
      eq(researchSessions.organization_id, organizationId)
    ),
  });
}

export async function getResearchSessionsByOrganization(
  organizationId: string,
  options?: { limit?: number; offset?: number }
) {
  let query = db.query.researchSessions.findMany({
    where: eq(researchSessions.organization_id, organizationId),
    orderBy: (sessions) => [sessions.created_at],
  });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.offset(options.offset);

  return query;
}

export async function getResearchSessionsByProject(
  projectId: string,
  organizationId: string
) {
  return db.query.researchSessions.findMany({
    where: and(
      eq(researchSessions.project_id, projectId),
      eq(researchSessions.organization_id, organizationId)
    ),
    orderBy: (sessions) => [sessions.created_at],
  });
}

export async function createResearchSession(
  organizationId: string,
  data: CreateResearchSessionInput
) {
  const [session] = await db
    .insert(researchSessions)
    .values({
      organization_id: organizationId,
      status: 'draft',
      ...data,
      created_at: new Date(),
    })
    .returning();

  return session;
}

export async function updateResearchSession(
  id: string,
  organizationId: string,
  data: UpdateResearchSessionInput
) {
  const [session] = await db
    .update(researchSessions)
    .set({
      ...data,
    })
    .where(
      and(
        eq(researchSessions.id, id),
        eq(researchSessions.organization_id, organizationId)
      )
    )
    .returning();

  return session;
}

export async function getSessionMessages(sessionId: string, organizationId: string) {
  const session = await getResearchSessionById(sessionId, organizationId);
  if (!session) return [];

  return db.query.messages.findMany({
    where: eq(messages.research_session_id, sessionId),
    orderBy: (messages) => [messages.created_at],
  });
}

export async function getResearchSessionCount(organizationId: string) {
  const result = await db
    .select({ count: researchSessions.id })
    .from(researchSessions)
    .where(eq(researchSessions.organization_id, organizationId));

  return result[0]?.count ? 1 : 0;
}
