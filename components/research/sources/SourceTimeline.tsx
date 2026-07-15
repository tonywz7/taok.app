'use client'

import React from 'react'
import { CircleCheck, CircleDot, FileSearch, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SourceTimelineEvent, SourceTimelinePhase } from '@/types/citations'

const PHASE_ICON: Record<SourceTimelinePhase, React.ComponentType<{ className?: string }>> = {
  discovered: CircleDot,
  collected: CircleDot,
  extracted: FileSearch,
  processed: RefreshCw,
  verified: ShieldCheck,
  updated: CircleCheck,
  conflict: TriangleAlert,
}

const PHASE_TONE: Record<SourceTimelinePhase, string> = {
  discovered: 'text-muted-foreground',
  collected: 'text-muted-foreground',
  extracted: 'text-foreground',
  processed: 'text-foreground',
  verified: 'text-success',
  updated: 'text-foreground',
  conflict: 'text-warning',
}

function formatTime(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  return new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export interface SourceTimelineProps {
  events: SourceTimelineEvent[]
  className?: string
}

/**
 * Vertical provenance timeline: discovered -> collected -> extracted ->
 * processed -> verified/updated. Timestamps are shown in a mono column.
 */
function SourceTimelineImpl({ events, className }: SourceTimelineProps) {
  if (events.length === 0) {
    return <p className="text-xs text-muted-foreground">No lifecycle events recorded.</p>
  }

  return (
    <ol className={cn('relative flex flex-col', className)} aria-label="Source timeline">
      {events.map((event, index) => {
        const Icon = PHASE_ICON[event.phase]
        const isLast = index === events.length - 1
        return (
          <li key={event.id} className="flex gap-3">
            <span className="w-11 shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {formatTime(event.at)}
            </span>
            <div className="flex flex-col items-center">
              <span className={cn('flex size-5 items-center justify-center rounded-full border bg-card', PHASE_TONE[event.phase])}>
                <Icon className="size-3" aria-hidden />
              </span>
              {!isLast && <span className="w-px flex-1 bg-border" aria-hidden />}
            </div>
            <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-4')}>
              <p className="text-xs font-medium text-foreground">{event.label}</p>
              {event.detail && <p className="mt-0.5 text-[11px] text-muted-foreground text-pretty">{event.detail}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export const SourceTimeline = React.memo(SourceTimelineImpl)
export default SourceTimeline
