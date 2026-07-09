-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  stripe_customer_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_created_at ON organizations(created_at);

-- Organization Members
CREATE TABLE IF NOT EXISTS organization_members (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_member_org_id ON organization_members(organization_id);
CREATE INDEX idx_member_user_id ON organization_members(user_id);
CREATE UNIQUE INDEX idx_member_org_user ON organization_members(organization_id, user_id);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_org_id ON projects(organization_id);
CREATE INDEX idx_project_created_at ON projects(created_at);
CREATE INDEX idx_project_status ON projects(status);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  legal_name text NOT NULL,
  display_name text NOT NULL,
  domain text,
  website text,
  linkedin_url text,
  industry text,
  description text,
  location text,
  employee_count integer,
  revenue_range text,
  funding_stage text,
  confidence integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_company_org_id ON companies(organization_id);
CREATE INDEX idx_company_domain ON companies(domain);
CREATE INDEX idx_company_created_at ON companies(created_at);
CREATE INDEX idx_company_org_created ON companies(organization_id, created_at);

-- People
CREATE TABLE IF NOT EXISTS people (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id varchar(26) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text NOT NULL,
  title text,
  seniority text CHECK (seniority IN ('c_level', 'vp', 'director', 'manager', 'ic', 'founder', 'other')),
  department text,
  linkedin_url text,
  email text,
  confidence integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_people_org_id ON people(organization_id);
CREATE INDEX idx_people_company_id ON people(company_id);
CREATE INDEX idx_people_linkedin_url ON people(linkedin_url);
CREATE INDEX idx_people_email ON people(email);
CREATE INDEX idx_people_created_at ON people(created_at);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  person_id varchar(26) NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  company_id varchar(26) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'lead', 'qualified', 'engaged', 'customer', 'archived')),
  source text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_org_id ON contacts(organization_id);
CREATE INDEX idx_contact_person_id ON contacts(person_id);
CREATE INDEX idx_contact_company_id ON contacts(company_id);
CREATE INDEX idx_contact_status ON contacts(status);

-- Sources
CREATE TABLE IF NOT EXISTS sources (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  url text,
  title text,
  raw_payload jsonb,
  checksum text NOT NULL,
  fetched_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_source_org_id ON sources(organization_id);
CREATE INDEX idx_source_provider ON sources(provider);
CREATE INDEX idx_source_checksum ON sources(checksum);
CREATE INDEX idx_source_created_at ON sources(created_at);

-- Citations
CREATE TABLE IF NOT EXISTS citations (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('company', 'person', 'contact')),
  entity_id varchar(26) NOT NULL,
  source_id varchar(26) NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  claim text NOT NULL,
  confidence integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_citation_org_id ON citations(organization_id);
CREATE INDEX idx_citation_entity ON citations(entity_type, entity_id);
CREATE INDEX idx_citation_source_id ON citations(source_id);

-- Research Sessions
CREATE TABLE IF NOT EXISTS research_sessions (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  organization_id varchar(26) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id varchar(26) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'archived')),
  query text NOT NULL,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_org_id ON research_sessions(organization_id);
CREATE INDEX idx_session_project_id ON research_sessions(project_id);
CREATE INDEX idx_session_status ON research_sessions(status);
CREATE INDEX idx_session_created_at ON research_sessions(created_at);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id varchar(26) PRIMARY KEY DEFAULT gen_ulid(),
  research_session_id varchar(26) NOT NULL REFERENCES research_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_session_id ON messages(research_session_id);
CREATE INDEX idx_message_created_at ON messages(created_at);
