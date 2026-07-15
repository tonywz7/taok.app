'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ResolvedCitation } from '@/types/citations'
import { SourcePreview } from './SourcePreview'

export interface CitationCardProps {
  citation: ResolvedCitation
  /** Called when the card is activated (opens details). */
  onOpen?: (citationId: string) => void
  /** Highlight state, e.g. when its inline badge is focused. */
  active?: boolean
  className?: string
}

/**
 * A card that ties a claim to its source with all provenance metadata.
 * Fully keyboard operable; the whole card acts as a button when `onOpen` is set.
 */
function CitationCardImpl({ citation, onOpen, active = false, className }: CitationCardProps) {
  const interactive = typeof onOpen === 'function'
  const handleOpen = React.useCallback(() => onOpen?.(citation.id), [onOpen, citation.id])

  return (
    <article
      className={cn(
        'rounded-lg border bg-card p-3.5 text-left transition-colors',
        interactive && 'cursor-pointer hover:border-foreground/30 hover:bg-accent/40',
        active && 'border-foreground/40 ring-1 ring-ring',
        className,
      )}
      {...(interactive
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': `Citation ${citation.reference}: ${citation.claim}`,
            onClick: handleOpen,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpen()
              }
            },
          }
        : {})}
    >
      <div className="mb-2.5 flex items-start gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-foreground font-mono text-[11px] font-semibold text-background">
          {citation.reference}
        </span>
        <p className="text-sm font-medium leading-snug text-foreground text-pretty">{citation.claim}</p>
      </div>
      <SourcePreview source={citation.source} />
    </article>
  )
}

export const CitationCard = React.memo(CitationCardImpl)
export default CitationCard
