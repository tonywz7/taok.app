'use client'

import React from 'react'
import { Quote, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResolvedCitation } from '@/types/citations'
import { SourcePreview } from './SourcePreview'
import { SourceTrustScore } from './SourceTrustScore'
import { SourceTimeline } from '../sources/SourceTimeline'

function Section({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

export interface CitationDetailsProps {
  citation: ResolvedCitation
  /** Related citations resolved from ids, for the "related" section. */
  related?: ResolvedCitation[]
  onOpenRelated?: (citationId: string) => void
  className?: string
}

/**
 * Full explanation for a single citation: source, extracted evidence, Taok's
 * interpretation, confidence reasoning, related citations, and the timeline.
 */
function CitationDetailsImpl({ citation, related = [], onOpenRelated, className }: CitationDetailsProps) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="rounded-lg border bg-accent/40 p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-foreground font-mono text-[11px] font-semibold text-background">
            {citation.reference}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Referenced claim
          </span>
        </div>
        <p className="text-sm font-medium leading-snug text-foreground text-pretty">{citation.claim}</p>
      </div>

      <Section title="Original source">
        <div className="rounded-lg border bg-card p-3">
          <SourcePreview source={citation.source} />
        </div>
      </Section>

      {citation.evidence && (
        <Section title="Extracted evidence">
          <blockquote className="flex gap-2 rounded-lg border-l-2 border-foreground/30 bg-muted/50 p-3 text-sm leading-relaxed text-foreground">
            <Quote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-pretty">{citation.evidence}</span>
          </blockquote>
        </Section>
      )}

      {citation.interpretation && (
        <Section title="AI interpretation">
          <div className="flex gap-2 rounded-lg border bg-card p-3 text-sm leading-relaxed text-foreground">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-pretty">{citation.interpretation}</span>
          </div>
        </Section>
      )}

      <Section title="Confidence reasoning">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
          <SourceTrustScore score={citation.confidence} />
          {citation.confidenceReasoning && (
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {citation.confidenceReasoning}
            </p>
          )}
        </div>
      </Section>

      {related.length > 0 && (
        <Section title="Related citations">
          <ul className="flex flex-col gap-1.5">
            {related.map((rel) => (
              <li key={rel.id}>
                <button
                  type="button"
                  onClick={() => onOpenRelated?.(rel.id)}
                  className="flex w-full items-start gap-2 rounded-md border bg-card p-2 text-left text-xs transition-colors hover:border-foreground/30 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] font-semibold text-muted-foreground">
                    {rel.reference}
                  </span>
                  <span className="text-pretty text-foreground">{rel.claim}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {citation.source.timeline && citation.source.timeline.length > 0 && (
        <Section title="Timeline">
          <SourceTimeline events={citation.source.timeline} />
        </Section>
      )}
    </div>
  )
}

export const CitationDetails = React.memo(CitationDetailsImpl)
export default CitationDetails
