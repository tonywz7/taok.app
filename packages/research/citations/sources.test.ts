import { describe, expect, it } from 'vitest'
import type { ResearchSource } from '@/types/citations'
import {
  filterSources,
  groupSourcesByType,
  matchesQuery,
  sortSources,
  summarizeSources,
} from './sources'

function makeSource(overrides: Partial<ResearchSource> & Pick<ResearchSource, 'id'>): ResearchSource {
  return {
    type: 'web_article',
    provider: 'Serper',
    title: 'Untitled',
    collectedAt: '2026-07-16T10:00:00.000Z',
    trustScore: 80,
    verification: 'single_source',
    ...overrides,
  }
}

const sources: ResearchSource[] = [
  makeSource({ id: 'a', title: 'Acme raises Series B', domain: 'techcrunch.com', type: 'news', trustScore: 92, verification: 'cross_checked', collectedAt: '2026-07-16T10:05:00.000Z' }),
  makeSource({ id: 'b', title: 'Acme on GitHub', domain: 'github.com', type: 'github', trustScore: 70, verification: 'single_source', collectedAt: '2026-07-16T10:02:00.000Z' }),
  makeSource({ id: 'c', title: 'Crunchbase profile', domain: 'crunchbase.com', type: 'company_database', trustScore: 88, verification: 'verified', collectedAt: '2026-07-16T10:09:00.000Z' }),
  makeSource({ id: 'd', title: 'Reddit thread', domain: 'reddit.com', type: 'social_signal', trustScore: 40, verification: 'conflicting', collectedAt: '2026-07-16T10:01:00.000Z' }),
]

describe('source query', () => {
  it('matches across title, domain, provider, snippet', () => {
    expect(matchesQuery(sources[0], 'series b')).toBe(true)
    expect(matchesQuery(sources[0], 'techcrunch')).toBe(true)
    expect(matchesQuery(sources[0], 'serper')).toBe(true)
    expect(matchesQuery(sources[0], 'nonexistent')).toBe(false)
    expect(matchesQuery(sources[0], '   ')).toBe(true)
  })
})

describe('filterSources', () => {
  it('filters by query, type, verification, and minTrust', () => {
    expect(filterSources(sources, { query: 'acme' }).map((s) => s.id)).toEqual(['a', 'b'])
    expect(filterSources(sources, { types: ['news', 'github'] }).map((s) => s.id)).toEqual(['a', 'b'])
    expect(filterSources(sources, { verification: ['verified', 'cross_checked'] }).map((s) => s.id)).toEqual(['a', 'c'])
    expect(filterSources(sources, { minTrust: 85 }).map((s) => s.id)).toEqual(['a', 'c'])
    expect(filterSources(sources, {}).length).toBe(4)
  })
})

describe('sortSources', () => {
  it('does not mutate input and orders by key', () => {
    const before = sources.map((s) => s.id)
    expect(sortSources(sources, 'trust').map((s) => s.id)).toEqual(['a', 'c', 'b', 'd'])
    expect(sortSources(sources, 'recent').map((s) => s.id)).toEqual(['c', 'a', 'b', 'd'])
    expect(sortSources(sources, 'verification').map((s) => s.id)).toEqual(['c', 'a', 'b', 'd'])
    expect(sortSources(sources, 'title').map((s) => s.id)).toEqual(['b', 'a', 'c', 'd'])
    expect(sources.map((s) => s.id)).toEqual(before)
  })
})

describe('groupSourcesByType', () => {
  it('groups in canonical order, omitting empty groups', () => {
    const groups = groupSourcesByType(sources)
    expect(groups.map((g) => g.type)).toEqual(['news', 'company_database', 'github', 'social_signal'])
    expect(groups[0].sources.map((s) => s.id)).toEqual(['a'])
  })
})

describe('summarizeSources', () => {
  it('computes totals, verified, conflicting, and average trust', () => {
    expect(summarizeSources(sources)).toEqual({ total: 4, verified: 2, conflicting: 1, averageTrust: 73 })
    expect(summarizeSources([])).toEqual({ total: 0, verified: 0, conflicting: 0, averageTrust: 0 })
  })
})
