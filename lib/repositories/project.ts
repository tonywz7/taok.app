import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateProjectInput, UpdateProjectInput } from '@/lib/validation';

export async function getProjectById(id: string, organizationId: string) {
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, id),
      eq(projects.organization_id, organizationId)
    ),
  });
}

export async function getProjectsByOrganization(
  organizationId: string,
  options?: { limit?: number; offset?: number }
) {
  let query = db.query.projects.findMany({
    where: and(
      eq(projects.organization_id, organizationId),
      eq(projects.status, 'active')
    ),
    orderBy: (projects) => [projects.created_at],
  });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.offset(options.offset);

  return query;
}

export async function createProject(
  organizationId: string,
  data: CreateProjectInput
) {
  const [project] = await db
    .insert(projects)
    .values({
      organization_id: organizationId,
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return project;
}

export async function updateProject(
  id: string,
  organizationId: string,
  data: UpdateProjectInput
) {
  const [project] = await db
    .update(projects)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(projects.id, id),
        eq(projects.organization_id, organizationId)
      )
    )
    .returning();

  return project;
}

export async function deleteProject(id: string, organizationId: string) {
  const [project] = await db
    .delete(projects)
    .where(
      and(
        eq(projects.id, id),
        eq(projects.organization_id, organizationId)
      )
    )
    .returning();

  return project;
}

export async function getProjectCount(organizationId: string) {
  const result = await db
    .select({ count: projects.id })
    .from(projects)
    .where(eq(projects.organization_id, organizationId));

  return result[0]?.count ? 1 : 0;
}
