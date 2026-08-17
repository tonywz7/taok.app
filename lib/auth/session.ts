import { headers } from 'next/headers'
import { and, asc, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { organizationMembers } from '@/lib/db/schema'

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user.id ?? null
}

export async function getUserOrganizationId(userId: string): Promise<string | null> {
  const [membership] = await db
    .select({ organizationId: organizationMembers.organization_id })
    .from(organizationMembers)
    .where(eq(organizationMembers.user_id, userId))
    .orderBy(asc(organizationMembers.created_at))
    .limit(1)

  return membership?.organizationId ?? null
}

export async function getUserOrganizations(userId: string): Promise<string[]> {
  const memberships = await db
    .select({ organizationId: organizationMembers.organization_id })
    .from(organizationMembers)
    .where(eq(organizationMembers.user_id, userId))

  return memberships.map(({ organizationId }) => organizationId)
}

export async function isOrganizationMember(userId: string, organizationId: string) {
  const [membership] = await db
    .select({ id: organizationMembers.id })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.user_id, userId),
        eq(organizationMembers.organization_id, organizationId),
      ),
    )
    .limit(1)

  return Boolean(membership)
}
