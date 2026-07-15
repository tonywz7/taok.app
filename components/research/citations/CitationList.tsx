'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ResolvedCitation } from '@/types/citations'
import { CitationCard } from './CitationCard'
import { useCitations } from './CitationContext'

export interface CitationListProps {
  /** Explicit citations; falls back to the citation context. */
  citations?: ResolvedCitation[]
  activeCitationId?: string | null
  onOpen?: (citationId: string) => void
  className?: string
  emptyLabel?: string
}

/**
 * Numbered list of citation cards. Reads from context by default so it stays
 * in sync with inline badges and the drawer.
 */
function CitationListImpl({
  citations,
  activeCitationId,
  onOpen,
  className,
  emptyLabel = 'No citations yet. Evidence appears here as research streams in.',
}: CitationListProps) {
  const ctx = useCitations()
  const items = citations ?? ctx?.citations ?? []
  const active = activeCitationId ?? ctx?.activeCitationId ?? null
  const handleOpen = onOpen ?? ctx?.openCitation

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <ol className={cn('flex flex-col gap-2.5', className)} aria-label="Citations">
      {items.map((citation) => (
        <li key={citation.id}>
          <CitationCard
            citation={citation}
            active={active === citation.id}
            onOpen={handleOpen}
          />
        </li>
      ))}
    </ol>
  )
}

export const CitationList = React.memo(CitationListImpl)
export default CitationList
