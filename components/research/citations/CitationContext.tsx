'use client'

import React from 'react'
import type { ResolvedCitation } from '@/types/citations'

interface CitationContextValue {
  citations: ResolvedCitation[]
  byId: Map<string, ResolvedCitation>
  activeCitationId: string | null
  openCitation: (id: string) => void
  closeCitation: () => void
}

const CitationContext = React.createContext<CitationContextValue | null>(null)

export interface CitationProviderProps {
  citations: ResolvedCitation[]
  children: React.ReactNode
}

/**
 * Holds the resolved citations for a research answer and coordinates which
 * citation is expanded in the drawer. Any inline badge can trigger the drawer
 * without prop drilling.
 */
export function CitationProvider({ citations, children }: CitationProviderProps) {
  const [activeCitationId, setActiveCitationId] = React.useState<string | null>(null)

  const byId = React.useMemo(() => {
    const map = new Map<string, ResolvedCitation>()
    for (const citation of citations) map.set(citation.id, citation)
    return map
  }, [citations])

  const openCitation = React.useCallback((id: string) => setActiveCitationId(id), [])
  const closeCitation = React.useCallback(() => setActiveCitationId(null), [])

  const value = React.useMemo<CitationContextValue>(
    () => ({ citations, byId, activeCitationId, openCitation, closeCitation }),
    [citations, byId, activeCitationId, openCitation, closeCitation],
  )

  return <CitationContext.Provider value={value}>{children}</CitationContext.Provider>
}

/** Access the citation context. Returns null outside a provider (badges degrade gracefully). */
export function useCitations(): CitationContextValue | null {
  return React.useContext(CitationContext)
}
