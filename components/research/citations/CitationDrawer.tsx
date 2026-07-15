'use client'

import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ResolvedCitation } from '@/types/citations'
import { useCitations } from './CitationContext'

// Lazy-load the (relatively heavy) details tree so it only ships when opened.
const CitationDetails = React.lazy(() =>
  import('./CitationDetails').then((m) => ({ default: m.CitationDetails })),
)

function DetailsFallback() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
      <div className="h-20 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

/**
 * Side drawer that explains the active citation. Driven entirely by the
 * citation context: any `CitationBadge` opening a citation surfaces here.
 * Renders nothing extra to the DOM when closed.
 */
export function CitationDrawer() {
  const ctx = useCitations()
  const active: ResolvedCitation | null =
    ctx && ctx.activeCitationId ? ctx.byId.get(ctx.activeCitationId) ?? null : null

  const related = React.useMemo<ResolvedCitation[]>(() => {
    if (!ctx || !active?.relatedCitationIds) return []
    return active.relatedCitationIds
      .map((id) => ctx.byId.get(id))
      .filter((c): c is ResolvedCitation => Boolean(c))
  }, [ctx, active])

  if (!ctx) return null

  return (
    <Sheet
      open={ctx.activeCitationId !== null}
      onOpenChange={(open) => {
        if (!open) ctx.closeCitation()
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
        aria-label="Citation details"
      >
        <SheetHeader className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <SheetTitle className="text-sm">
            {active ? `Citation [${active.reference}]` : 'Citation'}
          </SheetTitle>
          <SheetDescription>Evidence, interpretation, and confidence behind this claim.</SheetDescription>
        </SheetHeader>

        <div className="p-4">
          {active ? (
            <React.Suspense fallback={<DetailsFallback />}>
              <CitationDetails
                citation={active}
                related={related}
                onOpenRelated={ctx.openCitation}
              />
            </React.Suspense>
          ) : (
            <p className="text-sm text-muted-foreground">Select a citation to view its evidence.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CitationDrawer
