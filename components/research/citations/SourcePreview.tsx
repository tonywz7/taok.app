'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResearchSource } from '@/types/citations'
import { sourceTypeLabel } from '@/packages/research/citations'
import { SOURCE_TYPE_ICON } from './sourceIcons'
import { VerificationBadge } from './VerificationBadge'
import { SourceTrustScore } from './SourceTrustScore'

export interface SourcePreviewProps {
  source: ResearchSource
  /** Compact layout for dense lists. */
  compact?: boolean
  /** Show the trust score row. */
  showTrust?: boolean
  className?: string
}

function formatDate(iso?: string): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  return new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Presentational summary of a single source: type, provider, domain, title,
 * snippet, dates, trust score, verification, and an "open source" affordance.
 */
function SourcePreviewImpl({ source, compact = false, showTrust = true, className }: SourcePreviewProps) {
  const Icon = SOURCE_TYPE_ICON[source.type]
  const published = formatDate(source.publishedAt)
  const collected = formatDate(source.collectedAt)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border bg-card text-foreground">
          <Icon className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{sourceTypeLabel(source.type)}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{source.provider}</span>
            {source.domain && (
              <>
                <span aria-hidden>·</span>
                <span className="truncate font-mono">{source.domain}</span>
              </>
            )}
          </div>
          <h4 className={cn('mt-0.5 font-medium text-foreground text-pretty', compact ? 'text-sm' : 'text-sm leading-snug')}>
            {source.title}
          </h4>
        </div>
      </div>

      {!compact && source.snippet && (
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{source.snippet}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {showTrust && <SourceTrustScore score={source.trustScore} size="sm" />}
        <VerificationBadge status={source.verification} size="sm" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {published && (
          <span>
            Published <span className="font-mono">{published}</span>
          </span>
        )}
        {collected && (
          <span>
            Collected <span className="font-mono">{collected}</span>
          </span>
        )}
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open source
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}

export const SourcePreview = React.memo(SourcePreviewImpl)
export default SourcePreview
