/**
 * Citation & Sources Intelligence Layer — canonical domain types.
 *
 * These types describe the trust layer of Taok: how research claims are backed
 * by evidence, where that evidence came from, how reliable it is, and how it was
 * verified over time. They are shared across UI components, hooks, and the pure
 * logic package (`packages/research/citations`).
 *
 * No `any`. Every field is explicit.
 */

/** The eight source categories Taok can collect evidence from. */
export type SourceType =
  | 'web_article'
  | 'company_database'
  | 'social_signal'
  | 'github'
  | 'news'
  | 'research_paper'
  | 'internal_data'
  | 'user_provided'

/** Human-facing verification state of a citation or source. */
export type VerificationStatus =
  | 'verified'
  | 'cross_checked'
  | 'single_source'
  | 'unverified'
  | 'conflicting'

/**
 * Bucketed confidence, derived from a 0..100 numeric score.
 * See `packages/research/citations/confidence.ts` for the canonical mapping.
 */
export type ConfidenceLevel = 'high' | 'verified' | 'review' | 'low'

/** Lifecycle phases surfaced in the source timeline. */
export type SourceTimelinePhase =
  | 'discovered'
  | 'collected'
  | 'extracted'
  | 'processed'
  | 'verified'
  | 'updated'
  | 'conflict'

export interface SourceTimelineEvent {
  id: string
  phase: SourceTimelinePhase
  label: string
  /** ISO-8601 timestamp. */
  at: string
  detail?: string
}

/**
 * A single piece of evidence Taok collected. A source can back many citations.
 */
export interface ResearchSource {
  id: string
  type: SourceType
  /** Data provider / connector that surfaced the source (e.g. "Crunchbase", "Serper"). */
  provider: string
  title: string
  url?: string
  /** Registrable domain, pre-computed for display and filtering. */
  domain?: string
  /** ISO-8601 date the source content was originally published. */
  publishedAt?: string
  /** ISO-8601 date Taok collected the source. */
  collectedAt: string
  /** Short extracted snippet shown in previews. */
  snippet?: string
  /** 0..100 trust score for the source itself. */
  trustScore: number
  verification: VerificationStatus
  /** Optional favicon / logo URL for the source domain. */
  favicon?: string
  /** Ordered lifecycle events for the timeline view. */
  timeline?: SourceTimelineEvent[]
}

/**
 * A citation ties a specific research claim to a source, with the evidence and
 * reasoning that justifies Taok's interpretation.
 */
export interface ResearchCitation {
  id: string
  /** 1-based reference number rendered inline, e.g. `[1]`. */
  reference: number
  sourceId: string
  /** The claim in the research output this citation supports. */
  claim: string
  /** Verbatim text extracted from the source that supports the claim. */
  evidence?: string
  /** Taok's interpretation of the evidence in the context of the claim. */
  interpretation?: string
  /** Plain-language explanation of the confidence score. */
  confidenceReasoning?: string
  /** 0..100 confidence score for this specific claim/source pairing. */
  confidence: number
  verification: VerificationStatus
  /** ISO-8601 timestamp the citation was created during research. */
  createdAt: string
  /** Ids of other citations that corroborate or relate to this one. */
  relatedCitationIds?: string[]
}

/** A citation joined with its resolved source, ready for rendering. */
export interface ResolvedCitation extends ResearchCitation {
  source: ResearchSource
}

/* -------------------------------------------------------------------------- */
/*                              Streaming events                              */
/* -------------------------------------------------------------------------- */

export interface SourceFoundEvent {
  type: 'source_found'
  source: ResearchSource
}

export interface CitationAddedEvent {
  type: 'citation_added'
  citation: ResearchCitation
}

export interface VerificationCompletedEvent {
  type: 'verification_completed'
  citationId: string
  verification: VerificationStatus
  /** Optional updated confidence after verification. */
  confidence?: number
  reasoning?: string
}

/** Discriminated union of all citation/source streaming events. */
export type CitationStreamEvent =
  | SourceFoundEvent
  | CitationAddedEvent
  | VerificationCompletedEvent

/** Aggregated citation/source state assembled from a stream. */
export interface CitationState {
  sources: Record<string, ResearchSource>
  citations: Record<string, ResearchCitation>
  /** Insertion order of citation ids, so references stay stable. */
  order: string[]
}

/* -------------------------------------------------------------------------- */
/*                                Type guards                                 */
/* -------------------------------------------------------------------------- */

export function isCitationStreamEvent(value: unknown): value is CitationStreamEvent {
  if (typeof value !== 'object' || value === null) return false
  const type = (value as { type?: unknown }).type
  return (
    type === 'source_found' ||
    type === 'citation_added' ||
    type === 'verification_completed'
  )
}
