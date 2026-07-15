import { describe, expect, it } from 'vitest'
import type { CitationStreamEvent, ResearchCitation, ResearchSource } from '@/types/citations'
import {
  emptyCitationState,
  isCitationStreamEvent,
  reduceCitationEvent,
  reduceCitationEvents,
  referenceMap,
  resolveCitations,
} from './stream'

const source: ResearchSource = {
  id: 'src-1',
  type: 'news',
  provider: 'Serper',
  title: 'Acme raises Series B',
  domain: 'techcrunch.com',
  collectedAt: '2026-07-16T10:05:00.000Z',
  trustScore: 130, // intentionally out of range to test clamping
  verification: 'single_source',
}

const citation: ResearchCitation = {
  id: 'cit-1',
  reference: 1,
  sourceId: 'src-1',
  claim: 'Acme raised a Series B',
  confidence: 82,
  verification: 'single_source',
  createdAt: '2026-07-16T10:06:00.000Z',
}

describe('citation stream reducer', () => {
  it('is immutable and clamps incoming scores', () => {
    const initial = emptyCitationState()
    const next = reduceCitationEvent(initial, { type: 'source_found', source })
    expect(initial.sources).toEqual({})
    expect(next.sources['src-1'].trustScore).toBe(100)
  })

  it('preserves citation insertion order and dedupes', () => {
    const events: CitationStreamEvent[] = [
      { type: 'citation_added', citation: { ...citation, id: 'cit-1', reference: 1 } },
      { type: 'citation_added', citation: { ...citation, id: 'cit-2', reference: 2, sourceId: 'src-1' } },
      { type: 'citation_added', citation: { ...citation, id: 'cit-1', reference: 1, claim: 'updated claim' } },
    ]
    const state = reduceCitationEvents(emptyCitationState(), events)
    expect(state.order).toEqual(['cit-1', 'cit-2'])
    expect(state.citations['cit-1'].claim).toBe('updated claim')
  })

  it('applies verification updates and ignores unknown citations', () => {
    let state = reduceCitationEvents(emptyCitationState(), [
      { type: 'citation_added', citation },
    ])
    state = reduceCitationEvent(state, {
      type: 'verification_completed',
      citationId: 'cit-1',
      verification: 'cross_checked',
      confidence: 95,
      reasoning: 'Confirmed by two outlets',
    })
    expect(state.citations['cit-1'].verification).toBe('cross_checked')
    expect(state.citations['cit-1'].confidence).toBe(95)
    expect(state.citations['cit-1'].confidenceReasoning).toBe('Confirmed by two outlets')

    const unchanged = reduceCitationEvent(state, {
      type: 'verification_completed',
      citationId: 'missing',
      verification: 'verified',
    })
    expect(unchanged).toBe(state)
  })

  it('resolves citations only when their source has arrived (streaming-safe)', () => {
    let state = reduceCitationEvents(emptyCitationState(), [{ type: 'citation_added', citation }])
    expect(resolveCitations(state)).toEqual([])
    state = reduceCitationEvent(state, { type: 'source_found', source })
    const resolved = resolveCitations(state)
    expect(resolved).toHaveLength(1)
    expect(resolved[0].source.id).toBe('src-1')
    expect(referenceMap(state)).toEqual({ 'cit-1': 1 })
  })
})

describe('isCitationStreamEvent', () => {
  it('validates event shape', () => {
    expect(isCitationStreamEvent({ type: 'source_found', source })).toBe(true)
    expect(isCitationStreamEvent({ type: 'citation_added', citation })).toBe(true)
    expect(isCitationStreamEvent({ type: 'verification_completed', citationId: 'x', verification: 'verified' })).toBe(true)
    expect(isCitationStreamEvent({ type: 'noise' })).toBe(false)
    expect(isCitationStreamEvent(null)).toBe(false)
    expect(isCitationStreamEvent('nope')).toBe(false)
  })
})
