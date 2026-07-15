import type { VerificationStatus, SourceType } from '@/types/citations'

export interface VerificationMeta {
  status: VerificationStatus
  label: string
  /** Short description for tooltips / screen readers. */
  description: string
  /** Whether the state should read as trustworthy (true), neutral, or a warning (false). */
  tone: 'positive' | 'neutral' | 'warning'
}

const VERIFICATION_META: Record<VerificationStatus, VerificationMeta> = {
  verified: {
    status: 'verified',
    label: 'Verified',
    description: 'Confirmed against a trusted primary source.',
    tone: 'positive',
  },
  cross_checked: {
    status: 'cross_checked',
    label: 'Cross Checked',
    description: 'Corroborated by two or more independent sources.',
    tone: 'positive',
  },
  single_source: {
    status: 'single_source',
    label: 'Single Source',
    description: 'Supported by exactly one source; not yet corroborated.',
    tone: 'neutral',
  },
  unverified: {
    status: 'unverified',
    label: 'Unverified',
    description: 'Collected but not yet verified by Taok.',
    tone: 'neutral',
  },
  conflicting: {
    status: 'conflicting',
    label: 'Conflicting Data',
    description: 'Sources disagree; manual review recommended.',
    tone: 'warning',
  },
}

export function verificationMeta(status: VerificationStatus): VerificationMeta {
  return VERIFICATION_META[status]
}

/** Ordered from most to least trustworthy, for sorting. */
export const VERIFICATION_RANK: Record<VerificationStatus, number> = {
  verified: 0,
  cross_checked: 1,
  single_source: 2,
  unverified: 3,
  conflicting: 4,
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  web_article: 'Web Article',
  company_database: 'Company Database',
  social_signal: 'Social Signal',
  github: 'GitHub',
  news: 'News',
  research_paper: 'Research Paper',
  internal_data: 'Internal Data',
  user_provided: 'User Provided Data',
}

export function sourceTypeLabel(type: SourceType): string {
  return SOURCE_TYPE_LABELS[type]
}

/** Stable display order for grouping sources by type. */
export const SOURCE_TYPE_ORDER: SourceType[] = [
  'web_article',
  'news',
  'company_database',
  'research_paper',
  'github',
  'social_signal',
  'internal_data',
  'user_provided',
]
