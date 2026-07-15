import type { ResearchSource, SourceType, VerificationStatus } from '@/types/citations'
import { SOURCE_TYPE_ORDER, VERIFICATION_RANK } from './verification'

export type SourceSortKey = 'trust' | 'recent' | 'verification' | 'title'

export interface SourceFilters {
  query?: string
  types?: SourceType[]
  verification?: VerificationStatus[]
  /** Minimum trust score (0..100). */
  minTrust?: number
}

/** Case-insensitive substring match across the human-searchable fields. */
export function matchesQuery(source: ResearchSource, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [source.title, source.domain, source.provider, source.snippet, source.url]
    .filter((v): v is string => typeof v === 'string')
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function filterSources(sources: readonly ResearchSource[], filters: SourceFilters = {}): ResearchSource[] {
  const { query = '', types, verification, minTrust } = filters
  return sources.filter((source) => {
    if (query && !matchesQuery(source, query)) return false
    if (types && types.length > 0 && !types.includes(source.type)) return false
    if (verification && verification.length > 0 && !verification.includes(source.verification)) return false
    if (typeof minTrust === 'number' && source.trustScore < minTrust) return false
    return true
  })
}

function toTime(iso?: string): number {
  if (!iso) return 0
  const t = Date.parse(iso)
  return Number.isNaN(t) ? 0 : t
}

/** Returns a new, stably sorted array; never mutates the input. */
export function sortSources(
  sources: readonly ResearchSource[],
  key: SourceSortKey = 'trust',
): ResearchSource[] {
  const copy = [...sources]
  switch (key) {
    case 'trust':
      return copy.sort((a, b) => b.trustScore - a.trustScore || a.title.localeCompare(b.title))
    case 'recent':
      return copy.sort((a, b) => toTime(b.collectedAt) - toTime(a.collectedAt) || a.title.localeCompare(b.title))
    case 'verification':
      return copy.sort(
        (a, b) =>
          VERIFICATION_RANK[a.verification] - VERIFICATION_RANK[b.verification] ||
          b.trustScore - a.trustScore,
      )
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return copy
  }
}

export interface SourceGroup {
  type: SourceType
  sources: ResearchSource[]
}

/** Group sources by type in the canonical display order, omitting empty groups. */
export function groupSourcesByType(sources: readonly ResearchSource[]): SourceGroup[] {
  const buckets = new Map<SourceType, ResearchSource[]>()
  for (const source of sources) {
    const list = buckets.get(source.type)
    if (list) list.push(source)
    else buckets.set(source.type, [source])
  }
  return SOURCE_TYPE_ORDER.filter((type) => buckets.has(type)).map((type) => ({
    type,
    sources: buckets.get(type) as ResearchSource[],
  }))
}

/** Merge collected/verified counts for a summary header. */
export interface SourceSummary {
  total: number
  verified: number
  conflicting: number
  averageTrust: number
}

export function summarizeSources(sources: readonly ResearchSource[]): SourceSummary {
  if (sources.length === 0) {
    return { total: 0, verified: 0, conflicting: 0, averageTrust: 0 }
  }
  let verified = 0
  let conflicting = 0
  let trustSum = 0
  for (const source of sources) {
    if (source.verification === 'verified' || source.verification === 'cross_checked') verified += 1
    if (source.verification === 'conflicting') conflicting += 1
    trustSum += source.trustScore
  }
  return {
    total: sources.length,
    verified,
    conflicting,
    averageTrust: Math.round(trustSum / sources.length),
  }
}
