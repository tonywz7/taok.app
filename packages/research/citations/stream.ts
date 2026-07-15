import type {
  CitationState,
  CitationStreamEvent,
  ResearchCitation,
  ResearchSource,
  ResolvedCitation,
} from '@/types/citations'
import { clampScore } from './confidence'

export function emptyCitationState(): CitationState {
  return { sources: {}, citations: {}, order: [] }
}

const STREAM_EVENT_TYPES = new Set([
  'source_found',
  'citation_added',
  'verification_completed',
])

/**
 * Runtime type guard for values arriving from an untyped stream (e.g. parsed
 * JSON / SSE). Validates the discriminant and the minimum required payload so
 * the reducer never receives a malformed event.
 */
export function isCitationStreamEvent(value: unknown): value is CitationStreamEvent {
  if (typeof value !== 'object' || value === null) return false
  const event = value as Record<string, unknown>
  if (typeof event.type !== 'string' || !STREAM_EVENT_TYPES.has(event.type)) return false
  switch (event.type) {
    case 'source_found':
      return typeof event.source === 'object' && event.source !== null
    case 'citation_added':
      return typeof event.citation === 'object' && event.citation !== null
    case 'verification_completed':
      return typeof event.citationId === 'string' && typeof event.verification === 'string'
    default:
      return false
  }
}

/**
 * Pure reducer that folds a citation/source streaming event into the aggregate
 * state. Always returns a new state object (immutable) so React can diff it.
 *
 * Handles out-of-order and duplicate events safely:
 *  - `source_found`   upserts a source (later payloads win).
 *  - `citation_added` upserts a citation, preserving insertion order.
 *  - `verification_completed` patches an existing citation's verification and,
 *    optionally, its confidence/reasoning. Unknown citation ids are ignored.
 */
export function reduceCitationEvent(
  state: CitationState,
  event: CitationStreamEvent,
): CitationState {
  switch (event.type) {
    case 'source_found': {
      const source: ResearchSource = {
        ...event.source,
        trustScore: clampScore(event.source.trustScore),
      }
      return {
        ...state,
        sources: { ...state.sources, [source.id]: source },
      }
    }
    case 'citation_added': {
      const citation: ResearchCitation = {
        ...event.citation,
        confidence: clampScore(event.citation.confidence),
      }
      const exists = citation.id in state.citations
      return {
        ...state,
        citations: { ...state.citations, [citation.id]: citation },
        order: exists ? state.order : [...state.order, citation.id],
      }
    }
    case 'verification_completed': {
      const existing = state.citations[event.citationId]
      if (!existing) return state
      const patched: ResearchCitation = {
        ...existing,
        verification: event.verification,
        confidence:
          typeof event.confidence === 'number' ? clampScore(event.confidence) : existing.confidence,
        confidenceReasoning: event.reasoning ?? existing.confidenceReasoning,
      }
      return {
        ...state,
        citations: { ...state.citations, [event.citationId]: patched },
      }
    }
    default:
      return state
  }
}

/** Fold an ordered batch of events into a single state. */
export function reduceCitationEvents(
  state: CitationState,
  events: readonly CitationStreamEvent[],
): CitationState {
  return events.reduce(reduceCitationEvent, state)
}

/**
 * Resolve citations against their sources, in stable reference order.
 * Citations whose source has not arrived yet are omitted (streaming-safe).
 */
export function resolveCitations(state: CitationState): ResolvedCitation[] {
  const resolved: ResolvedCitation[] = []
  for (const id of state.order) {
    const citation = state.citations[id]
    if (!citation) continue
    const source = state.sources[citation.sourceId]
    if (!source) continue
    resolved.push({ ...citation, source })
  }
  return resolved
}

/** Build a citationId -> reference number lookup from ordered state. */
export function referenceMap(state: CitationState): Record<string, number> {
  const map: Record<string, number> = {}
  state.order.forEach((id, index) => {
    const citation = state.citations[id]
    map[id] = citation?.reference ?? index + 1
  })
  return map
}
