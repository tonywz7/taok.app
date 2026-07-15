'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { confidenceLabelFromScore, confidenceLevelFromScore } from '@/packages/research/citations'
import { CONFIDENCE_TEXT, CONFIDENCE_TRACK } from './styles'

export interface SourceTrustScoreProps {
  /** 0..100 trust score. */
  score: number
  /** Visual size of the component. */
  size?: 'sm' | 'md'
  /** Render the descriptive label next to the score. */
  showLabel?: boolean
  className?: string
}

/**
 * Reusable trust indicator: numeric score, qualitative label, and a track.
 * Includes an accessible tooltip explaining what the score means.
 */
function SourceTrustScoreImpl({ score, size = 'md', showLabel = true, className }: SourceTrustScoreProps) {
  const level = confidenceLevelFromScore(score)
  const label = confidenceLabelFromScore(score)
  const pct = Math.max(0, Math.min(100, Math.round(score)))

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn('inline-flex items-center gap-2', className)}
          role="meter"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Trust score ${pct} percent, ${label}`}
        >
          <span
            className={cn(
              'font-mono font-semibold tabular-nums',
              CONFIDENCE_TEXT[level],
              size === 'sm' ? 'text-xs' : 'text-sm',
            )}
          >
            {pct}%
          </span>
          <span
            aria-hidden
            className={cn(
              'relative overflow-hidden rounded-full bg-muted',
              size === 'sm' ? 'h-1 w-10' : 'h-1.5 w-16',
            )}
          >
            <span
              className={cn('absolute inset-y-0 left-0 rounded-full', CONFIDENCE_TRACK[level])}
              style={{ width: `${pct}%` }}
            />
          </span>
          {showLabel && (
            <span
              className={cn(
                'font-medium',
                CONFIDENCE_TEXT[level],
                size === 'sm' ? 'text-[11px]' : 'text-xs',
              )}
            >
              {label}
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-pretty">
        Trust score reflects source reliability and corroboration. 90+ is High Trust, 75+ Verified,
        50+ Needs Review, below 50 Low Confidence.
      </TooltipContent>
    </Tooltip>
  )
}

export const SourceTrustScore = React.memo(SourceTrustScoreImpl)
export default SourceTrustScore
