'use client'

import React from 'react'
import { Play, RotateCcw, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitationStreamEvent } from '@/types/citations'
import { useCitationStream } from '@/hooks/useCitationStream'
import { CitationProvider } from './CitationContext'
import { CitationDrawer } from './CitationDrawer'
import { ResearchAnswer, type AnswerBlock } from '@/components/research/answer/ResearchAnswer'
import {
  ResearchReasoning,
  type ReasoningStep,
} from '@/components/research/answer/ResearchReasoning'
import {
  ResearchTimeline,
  type ResearchTimelineEntry,
} from '@/components/research/answer/ResearchTimeline'
import { ResearchSources } from '@/components/research/sources/ResearchSources'
import {
  SAMPLE_STREAM_EVENTS,
  SAMPLE_SOURCES,
} from '@/lib/research/citation-fixtures'

const ANSWER_BLOCKS: AnswerBlock[] = [
  {
    id: 'b1',
    text: 'Northwind AI recently raised a $48M Series B led by Meridian Ventures [1], capital the company says will fund expansion of its enterprise research platform [2].',
  },
  {
    id: 'b2',
    heading: 'Signals of momentum',
    text: 'Engineering activity has accelerated, with public commit velocity up roughly 3x last quarter [3], and the company has signalled plans to grow headcount to around 120 people [4]. Note that the headcount figure is self-reported and unverified [4].',
  },
  {
    id: 'b3',
    heading: 'Market context',
    text: 'One analyst pegs the enterprise research-agent market near $6.1B in 2026 [5], though this estimate conflicts with a competing figure and should be treated with caution [5].',
  },
]

const REASONING_STEPS: ReasoningStep[] = [
  {
    id: 'r1',
    label: 'Established the funding facts',
    detail:
      'Started from the primary financial database and confirmed the round size and lead investor [1], then corroborated intent with a reputable news source [2].',
  },
  {
    id: 'r2',
    label: 'Assessed momentum signals',
    detail:
      'Used public engineering metrics as a directional signal [3] while explicitly down-weighting self-reported guidance [4].',
  },
  {
    id: 'r3',
    label: 'Flagged contested market data',
    detail:
      'Surfaced the analyst market estimate [5] but marked it as conflicting so the reader can judge it.',
  },
]

const TIMELINE_ENTRIES: ResearchTimelineEntry[] = [
  { id: 't1', at: '2026-07-16T10:20:00.000Z', title: 'Discovered financial + news sources', kind: 'info' },
  {
    id: 't2',
    at: '2026-07-16T10:22:00.000Z',
    title: 'Verified funding round',
    detail: 'Cross-checked the Series B against a primary filing [1].',
    kind: 'evidence',
  },
  {
    id: 't3',
    at: '2026-07-16T10:26:00.000Z',
    title: 'Detected market-size conflict',
    detail: 'Two analyst estimates disagree; flagged for review [5].',
    kind: 'milestone',
  },
]

export interface CitationWorkspaceProps {
  className?: string
}

/**
 * Interactive demo of the Citation & Sources trust layer. Replays a sample
 * research stream so citations, sources, and verification states appear
 * incrementally — exactly as they would during a live run.
 */
export function CitationWorkspace({ className }: CitationWorkspaceProps) {
  const { citations, sources, citationCounts, apply, reset } = useCitationStream()
  const [status, setStatus] = React.useState<'idle' | 'streaming' | 'done'>('idle')
  const [activeSourceId, setActiveSourceId] = React.useState<string | undefined>(undefined)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const run = React.useCallback(
    (events: readonly CitationStreamEvent[]) => {
      clearTimer()
      reset()
      setStatus('streaming')
      let i = 0
      const tick = () => {
        if (i >= events.length) {
          setStatus('done')
          timerRef.current = null
          return
        }
        apply(events[i])
        i += 1
        timerRef.current = setTimeout(tick, 550)
      }
      tick()
    },
    [apply, reset, clearTimer],
  )

  // Auto-play once on mount for an immediate, populated preview.
  React.useEffect(() => {
    run(SAMPLE_STREAM_EVENTS)
    return clearTimer
  }, [run, clearTimer])

  const streaming = status === 'streaming'

  return (
    <CitationProvider citations={citations}>
      <div className={cn('flex h-full min-h-0 flex-col', className)}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-foreground">Citation &amp; Sources</h1>
              <p className="text-[11px] text-muted-foreground">
                Every claim is backed by inspectable, verifiable evidence.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              {status === 'streaming'
                ? 'Researching…'
                : status === 'done'
                  ? `${citations.length} claims · ${sources.length} sources`
                  : 'Ready'}
            </span>
            <button
              type="button"
              onClick={() => run(SAMPLE_STREAM_EVENTS)}
              disabled={streaming}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {status === 'done' ? (
                <RotateCcw className="size-3.5" aria-hidden="true" />
              ) : (
                <Play className="size-3.5" aria-hidden="true" />
              )}
              {status === 'done' ? 'Replay' : 'Run'}
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-h-0 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              <ResearchAnswer
                blocks={ANSWER_BLOCKS}
                citations={citations}
                streaming={streaming}
              />
              <ResearchReasoning steps={REASONING_STEPS} citations={citations} />
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Research timeline
                </h4>
                <ResearchTimeline
                  entries={TIMELINE_ENTRIES}
                  citations={citations}
                  streaming={streaming}
                />
              </div>
            </div>
          </div>

          <aside className="min-h-0 border-t border-border lg:border-l lg:border-t-0">
            <ResearchSources
              sources={sources.length > 0 ? sources : SAMPLE_SOURCES}
              citationCounts={citationCounts}
              activeSourceId={activeSourceId}
              onSelectSource={(s) => setActiveSourceId(s.id)}
            />
          </aside>
        </div>

        <CitationDrawer />
      </div>
    </CitationProvider>
  )
}

export default CitationWorkspace
