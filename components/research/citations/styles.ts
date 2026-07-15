import type { ConfidenceLevel, SourceType, VerificationStatus } from '@/types/citations'

/**
 * Tailwind class maps for the trust layer. Centralised so every citation and
 * source surface renders confidence and verification identically. All colours
 * resolve to design tokens (success / warning / destructive / muted).
 */

export const CONFIDENCE_DOT: Record<ConfidenceLevel, string> = {
  high: 'bg-success',
  verified: 'bg-success/70',
  review: 'bg-warning',
  low: 'bg-destructive',
}

export const CONFIDENCE_TEXT: Record<ConfidenceLevel, string> = {
  high: 'text-success',
  verified: 'text-success',
  review: 'text-warning',
  low: 'text-destructive',
}

export const CONFIDENCE_TRACK: Record<ConfidenceLevel, string> = {
  high: 'bg-success',
  verified: 'bg-success/70',
  review: 'bg-warning',
  low: 'bg-destructive',
}

export type Tone = 'positive' | 'neutral' | 'warning'

export const TONE_BADGE: Record<Tone, string> = {
  positive: 'border-success/30 bg-success/10 text-success',
  neutral: 'border-border bg-muted text-muted-foreground',
  warning: 'border-warning/40 bg-warning/10 text-warning',
}

export const SOURCE_TYPE_ACCENT: Record<SourceType, string> = {
  web_article: 'text-muted-foreground',
  company_database: 'text-foreground',
  social_signal: 'text-muted-foreground',
  github: 'text-foreground',
  news: 'text-foreground',
  research_paper: 'text-foreground',
  internal_data: 'text-foreground',
  user_provided: 'text-muted-foreground',
}

/** Verification -> tone, mirrors `verificationMeta().tone` for styling. */
export const VERIFICATION_TONE: Record<VerificationStatus, Tone> = {
  verified: 'positive',
  cross_checked: 'positive',
  single_source: 'neutral',
  unverified: 'neutral',
  conflicting: 'warning',
}
