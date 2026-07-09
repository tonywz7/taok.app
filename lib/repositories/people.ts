import { db } from '@/lib/db';
import { people } from '@/lib/db/schema';
import { eq, and, ilike, limit, offset } from 'drizzle-orm';
import { CreatePersonInput, UpdatePersonInput, SearchPeopleInput } from '@/lib/validation';

export async function getPersonById(id: string, organizationId: string) {
  return db.query.people.findFirst({
    where: and(
      eq(people.id, id),
      eq(people.organization_id, organizationId)
    ),
  });
}

export async function getPeopleByOrganization(
  organizationId: string,
  options?: { limit?: number; offset?: number }
) {
  let query = db.query.people.findMany({
    where: eq(people.organization_id, organizationId),
    orderBy: (people) => [people.created_at],
  });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.offset(options.offset);

  return query;
}

export async function getPeopleByCompany(companyId: string, organizationId: string) {
  return db.query.people.findMany({
    where: and(
      eq(people.company_id, companyId),
      eq(people.organization_id, organizationId)
    ),
    orderBy: (people) => [people.created_at],
  });
}

export async function searchPeople(
  organizationId: string,
  searchInput: SearchPeopleInput
) {
  const { query, company_id, seniority, page = 1, limit: pageLimit = 20 } = searchInput;
  const pageOffset = (page - 1) * pageLimit;

  const filters: any[] = [eq(people.organization_id, organizationId)];

  if (query) {
    filters.push(
      ilike(people.full_name, `%${query}%`)
    );
  }

  if (company_id) {
    filters.push(eq(people.company_id, company_id));
  }

  if (seniority) {
    filters.push(eq(people.seniority, seniority));
  }

  return db.query.people.findMany({
    where: and(...filters),
    limit: pageLimit,
    offset: pageOffset,
    orderBy: (people) => [people.created_at],
  });
}

export async function createPerson(
  organizationId: string,
  data: CreatePersonInput
) {
  const fullName = `${data.first_name} ${data.last_name}`;
  
  const [person] = await db
    .insert(people)
    .values({
      organization_id: organizationId,
      full_name: fullName,
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return person;
}

export async function updatePerson(
  id: string,
  organizationId: string,
  data: UpdatePersonInput
) {
  const updates: any = { ...data, updated_at: new Date() };
  
  if (data.first_name || data.last_name) {
    const person = await getPersonById(id, organizationId);
    if (person) {
      const firstName = data.first_name || person.first_name;
      const lastName = data.last_name || person.last_name;
      updates.full_name = `${firstName} ${lastName}`;
    }
  }

  const [updatedPerson] = await db
    .update(people)
    .set(updates)
    .where(
      and(
        eq(people.id, id),
        eq(people.organization_id, organizationId)
      )
    )
    .returning();

  return updatedPerson;
}

export async function deletePerson(id: string, organizationId: string) {
  const [person] = await db
    .delete(people)
    .where(
      and(
        eq(people.id, id),
        eq(people.organization_id, organizationId)
      )
    )
    .returning();

  return person;
}

export async function getPeopleCount(organizationId: string) {
  const result = await db
    .select({ count: people.id })
    .from(people)
    .where(eq(people.organization_id, organizationId));

  return result[0]?.count ? 1 : 0;
}
