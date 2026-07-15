'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ConfidenceLevel, VerificationStatus } from '@/types/citations'
import { confidenceLevelFromScore } from '@/packages/research/citations'
import { CONFIDENCE_DOT, VERIFICATION_TONE } from './styles'
import { useCitations } from './CitationContext'

export interface CitationBadgeProps {
  /** 1-based reference number rendered inline, e.g. 1 -> [1]. */
  reference: number
  /** Citation id used to open the drawer. */
  citationId?: string
  confidence?: number
  verification?: VerificationStatus
  /** Explicit click handler; falls back to the citation context. */
  onOpen?: (citationId: string) => void
  className?: string
}

const RING: Record<'positive' | 'neutral' | 'warning', string> = {
  positive: 'ring-success/40',
  neutral: 'ring-border',
  warning: 'ring-warning/50',
}

/**
 * Inline, superscript-style citation reference: `claim [1]`. Clicking (or
 * activating with keyboard) opens the citation detail drawer. A small dot
 * conveys confidence at a glance.
 */
function CitationBadgeImpl({
  reference,
  citationId,
  confidence,
  verification = 'single_source',
  onOpen,
  className,
}: CitationBadgeProps) {
  const ctx = useCitations()
  const level: ConfidenceLevel =
    typeof confidence === 'number' ? confidenceLevelFromScore(confidence) : 'review'
  const tone = VERIFICATION_TONE[verification]

  const handleOpen = React.useCallback(() => {
    if (!citationId) return
    if (onOpen) onOpen(citationId)
    else ctx?.openCitation(citationId)
  }, [citationId, onOpen, ctx])

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label={`Citation ${reference}. Open source and evidence.`}
      aria-haspopup="dialog"
      className={cn(
        'group mx-0.5 inline-flex -translate-y-0.5 items-center gap-1 rounded-md bg-muted px-1.5 align-super text-[10px] font-semibold leading-none text-muted-foreground ring-1 ring-inset transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'py-0.5',
        RING[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full', CONFIDENCE_DOT[level])}
      />
      <span className="font-mono">{reference}</span>
    </button>
  )
}

export const CitationBadge = React.memo(CitationBadgeImpl)
export default CitationBadge
