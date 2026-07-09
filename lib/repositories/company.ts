import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';
import { eq, and, like, ilike, limit, offset } from 'drizzle-orm';
import { CreateCompanyInput, UpdateCompanyInput, SearchCompaniesInput } from '@/lib/validation';

export async function getCompanyById(id: string, organizationId: string) {
  return db.query.companies.findFirst({
    where: and(
      eq(companies.id, id),
      eq(companies.organization_id, organizationId)
    ),
  });
}

export async function getCompaniesByOrganization(
  organizationId: string,
  options?: { limit?: number; offset?: number }
) {
  let query = db.query.companies.findMany({
    where: eq(companies.organization_id, organizationId),
    orderBy: (companies) => [companies.created_at],
  });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.offset(options.offset);

  return query;
}

export async function searchCompanies(
  organizationId: string,
  searchInput: SearchCompaniesInput
) {
  const { query, industry, location, domain, page = 1, limit: pageLimit = 20 } = searchInput;
  const pageOffset = (page - 1) * pageLimit;

  const filters: any[] = [eq(companies.organization_id, organizationId)];

  if (query) {
    filters.push(
      ilike(companies.display_name, `%${query}%`)
    );
  }

  if (industry) {
    filters.push(ilike(companies.industry, `%${industry}%`));
  }

  if (location) {
    filters.push(ilike(companies.location, `%${location}%`));
  }

  if (domain) {
    filters.push(ilike(companies.domain, `%${domain}%`));
  }

  return db.query.companies.findMany({
    where: and(...filters),
    limit: pageLimit,
    offset: pageOffset,
    orderBy: (companies) => [companies.created_at],
  });
}

export async function createCompany(
  organizationId: string,
  data: CreateCompanyInput
) {
  const [company] = await db
    .insert(companies)
    .values({
      organization_id: organizationId,
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return company;
}

export async function updateCompany(
  id: string,
  organizationId: string,
  data: UpdateCompanyInput
) {
  const [company] = await db
    .update(companies)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(companies.id, id),
        eq(companies.organization_id, organizationId)
      )
    )
    .returning();

  return company;
}

export async function deleteCompany(id: string, organizationId: string) {
  const [company] = await db
    .delete(companies)
    .where(
      and(
        eq(companies.id, id),
        eq(companies.organization_id, organizationId)
      )
    )
    .returning();

  return company;
}

export async function getCompanyCount(organizationId: string) {
  const result = await db
    .select({ count: companies.id })
    .from(companies)
    .where(eq(companies.organization_id, organizationId));

  return result[0]?.count ? 1 : 0;
}
