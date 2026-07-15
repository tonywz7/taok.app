import type { ConfidenceLevel } from '@/types/citations'

/**
 * Canonical confidence thresholds (0..100).
 *
 *   >= 90  high      "High Trust"
 *   >= 75  verified  "Verified"
 *   >= 50  review    "Needs Review"
 *   <  50  low       "Low Confidence"
 */
export const CONFIDENCE_THRESHOLDS = {
  high: 90,
  verified: 75,
  review: 50,
} as const

/** Clamp an arbitrary number into the inclusive 0..100 score range. */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

/** Map a numeric 0..100 score to its bucketed confidence level. */
export function confidenceLevelFromScore(score: number): ConfidenceLevel {
  const value = clampScore(score)
  if (value >= CONFIDENCE_THRESHOLDS.high) return 'high'
  if (value >= CONFIDENCE_THRESHOLDS.verified) return 'verified'
  if (value >= CONFIDENCE_THRESHOLDS.review) return 'review'
  return 'low'
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: 'High Trust',
  verified: 'Verified',
  review: 'Needs Review',
  low: 'Low Confidence',
}

/** Human-facing label for a confidence level. */
export function confidenceLabel(level: ConfidenceLevel): string {
  return CONFIDENCE_LABELS[level]
}

/** Convenience: label directly from a numeric score. */
export function confidenceLabelFromScore(score: number): string {
  return confidenceLabel(confidenceLevelFromScore(score))
}
