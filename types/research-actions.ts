/**
 * Research Action Layer — canonical domain types.
 *
 * Phase 6E turns a completed research session into reusable business
 * intelligence: continue/follow-up, save, bookmark, share, export, and
 * integration-ready handoffs (workflow, CRM lead, monitoring).
 *
 * These types are shared across the pure logic package
 * (`packages/research/actions`), hooks, and UI components. No `any`.
 */

import type {
  ResearchCitation,
  ResearchSource,
  ResolvedCitation,
} from './citations'

/* -------------------------------------------------------------------------- */
/*                              Research snapshot                             */
/* -------------------------------------------------------------------------- */

/** A prose block of the final answer, with inline `[n]` markers. */
export interface SnapshotAnswerBlock {
  id: string
  heading?: string
  text: string
}

/** A reasoning step captured during research. */
export interface SnapshotReasoningStep {
  id: string
  label: string
  detail?: string
}

/** A timeline entry captured during research. */
export interface SnapshotTimelineEntry {
  id: string
  at: string
  title: string
  detail?: string
  kind?: 'info' | 'evidence' | 'milestone'
}

/** Kinds of entities a research session can surface. */
export type ResearchEntityKind = 'company' | 'person' | 'topic'

/** A lightweight entity reference surfaced by the research. */
export interface ResearchEntity {
  id: string
  kind: ResearchEntityKind
  name: string
  /** Optional descriptor, e.g. domain for a company or role for a person. */
  descriptor?: string
}

/**
 * The complete, serializable unit of a research session. Everything the
 * action layer needs to save, export, or share is captured here so callers
 * never have to re-derive it from scattered component state.
 */
export interface ResearchSnapshot {
  id: string
  question: string
  answer: SnapshotAnswerBlock[]
  reasoning: SnapshotReasoningStep[]
  timeline: SnapshotTimelineEntry[]
  citations: ResearchCitation[]
  sources: ResearchSource[]
  entities: ResearchEntity[]
  /** Aggregate 0..100 confidence for the session. */
  confidence: number
  /** ISO-8601 timestamp the research completed. */
  completedAt: string
}

/* -------------------------------------------------------------------------- */
/*                                 Save state                                 */
/* -------------------------------------------------------------------------- */

export type SaveState = 'unsaved' | 'saving' | 'saved' | 'error'

/** Persisted metadata about a saved research session. */
export interface SavedResearchMeta {
  id: string
  title: string
  description?: string
  /** ISO-8601. */
  createdAt: string
  /** ISO-8601. */
  updatedAt: string
  owner: string
  tags: string[]
  entityIds: string[]
  sourceIds: string[]
  bookmarked: boolean
}

/* -------------------------------------------------------------------------- */
/*                                  Bookmarks                                 */
/* -------------------------------------------------------------------------- */

export type BookmarkTargetType = 'session' | 'source' | 'entity' | 'insight'

export interface BookmarkRef {
  targetType: BookmarkTargetType
  targetId: string
  /** ISO-8601. */
  createdAt: string
  label?: string
}

/* -------------------------------------------------------------------------- */
/*                                   Sharing                                  */
/* -------------------------------------------------------------------------- */

export type ShareVisibility = 'private' | 'workspace' | 'public'

export type ShareAccessStatus = 'not_shared' | 'active' | 'revoked'

export interface ShareConfig {
  visibility: ShareVisibility
  /** Absolute or relative share URL, present once shared beyond private. */
  link?: string
  status: ShareAccessStatus
  /** ISO-8601 timestamp of the last visibility change. */
  updatedAt?: string
}

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export type ExportFormat = 'markdown' | 'pdf' | 'csv' | 'json'

/** What sections to include in an export. */
export interface ExportOptions {
  includeAnswer: boolean
  includeReasoning: boolean
  includeCitations: boolean
  includeSources: boolean
  includeTimeline: boolean
  includeEntities: boolean
  includeConfidence: boolean
}

/** A produced export artifact ready to download. */
export interface ExportArtifact {
  format: ExportFormat
  filename: string
  mimeType: string
  content: string
}

/* -------------------------------------------------------------------------- */
/*                             Follow-up research                             */
/* -------------------------------------------------------------------------- */

export type FollowUpKind = 'question' | 'refine' | 'scope' | 'constraint' | 'deeper'

export interface FollowUpRequest {
  kind: FollowUpKind
  prompt: string
}

export interface FollowUpValidation {
  ok: boolean
  error?: string
  normalized?: FollowUpRequest
}

/* -------------------------------------------------------------------------- */
/*                         Integration-ready actions                          */
/* -------------------------------------------------------------------------- */

export type WorkflowKind =
  | 'lead_list'
  | 'outreach_campaign'
  | 'monitoring'
  | 'crm_entry'

/** An integration-ready workflow definition derived from research. */
export interface WorkflowDraft {
  kind: WorkflowKind
  title: string
  description: string
  /** Entity ids the workflow will act on. */
  entityIds: string[]
  /** Source ids that seed the workflow. */
  sourceIds: string[]
  createdAt: string
}

/** CRM lead draft, prepared for a future CRM module. */
export interface CrmLeadDraft {
  entityId: string
  entityKind: ResearchEntityKind
  name: string
  descriptor?: string
  note?: string
  owner?: string
  sourceIds: string[]
  createdAt: string
}

export type MonitorSignal =
  | 'news'
  | 'funding'
  | 'hiring'
  | 'leadership'
  | 'product'
  | 'general'

/** Entity monitoring configuration, prepared for future alerting. */
export interface MonitorConfig {
  entityId: string
  entityKind: ResearchEntityKind
  name: string
  signals: MonitorSignal[]
  /** How often to check for changes. */
  cadence: 'realtime' | 'daily' | 'weekly'
  createdAt: string
}

/* -------------------------------------------------------------------------- */
/*                              Action registry                               */
/* -------------------------------------------------------------------------- */

export type ResearchActionId =
  | 'continue'
  | 'followup'
  | 'save'
  | 'bookmark'
  | 'share'
  | 'export'
  | 'create_lead'
  | 'monitor'
  | 'create_workflow'

/** Context that determines which actions are available/enabled. */
export interface ResearchActionContext {
  /** Whether the research run has completed. */
  completed: boolean
  /** Whether the user is reviewing a finished session. */
  reviewMode: boolean
  /** The currently selected entity, if any. */
  selectedEntity?: ResearchEntity
  /** Whether the current user may edit/share (permission gate). */
  canEdit: boolean
  canShare: boolean
}

/** Availability descriptor for a single action. */
export interface ResearchActionAvailability {
  id: ResearchActionId
  visible: boolean
  enabled: boolean
  /** Reason the action is disabled, for tooltips / a11y. */
  disabledReason?: string
}

export type { ResearchCitation, ResearchSource, ResolvedCitation }
