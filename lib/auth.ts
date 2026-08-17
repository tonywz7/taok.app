import { betterAuth } from 'better-auth'
import { db, pool } from '@/lib/db'
import { organizationMembers, organizations } from '@/lib/db/schema'


function getOrigin(value?: string) {
  if (!value) return undefined
  return value.startsWith('http') ? value : `https://${value}`
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  getOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  getOrigin(process.env.VERCEL_URL) ||
  process.env.V0_RUNTIME_URL

const trustedOrigins = [
  process.env.V0_RUNTIME_URL,
  getOrigin(process.env.VERCEL_URL),
  getOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
].filter((origin): origin is string => Boolean(origin))

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  baseURL,
  trustedOrigins,
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const slug = `${user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'workspace'}-${user.id.slice(-6)}`
          const [organization] = await db
            .insert(organizations)
            .values({ name: `${user.name}'s Workspace`, slug })
            .returning({ id: organizations.id })

          if (organization) {
            await db.insert(organizationMembers).values({
              organization_id: organization.id,
              user_id: user.id,
              role: 'owner',
            })
          }
        },
      },
    },
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})

export type Auth = typeof auth
