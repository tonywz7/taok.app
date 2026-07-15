'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { SourceType } from '@/types/citations'
import { sourceTypeLabel } from '@/packages/research/citations'
import type { SourceSortKey } from '@/packages/research/citations'
import { SOURCE_TYPE_ICON } from '../citations/sourceIcons'

const SORT_OPTIONS: { value: SourceSortKey; label: string }[] = [
  { value: 'trust', label: 'Trust' },
  { value: 'recent', label: 'Recent' },
  { value: 'verification', label: 'Verification' },
  { value: 'title', label: 'Title' },
]

export interface SourceFilterProps {
  /** Types available to filter (usually derived from the current sources). */
  availableTypes: SourceType[]
  activeTypes: SourceType[]
  onToggleType: (type: SourceType) => void
  sort: SourceSortKey
  onSortChange: (sort: SourceSortKey) => void
  /** Count per type for the chip badge. */
  counts?: Partial<Record<SourceType, number>>
  className?: string
}

/** Type filter chips plus a sort selector for the sources panel. */
function SourceFilterImpl({
  availableTypes,
  activeTypes,
  onToggleType,
  sort,
  onSortChange,
  counts,
  className,
}: SourceFilterProps) {
  const sortId = React.useId()
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by source type">
        {availableTypes.map((type) => {
          const Icon = SOURCE_TYPE_ICON[type]
          const active = activeTypes.includes(type)
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggleType(type)}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3" aria-hidden />
              {sourceTypeLabel(type)}
              {counts?.[type] != null && (
                <span className={cn('font-mono', active ? 'text-background/70' : 'text-muted-foreground')}>
                  {counts[type]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={sortId} className="text-[11px] text-muted-foreground">
          Sort
        </label>
        <select
          id={sortId}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SourceSortKey)}
          className="h-7 rounded-md border bg-card px-2 text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export const SourceFilter = React.memo(SourceFilterImpl)
export default SourceFilter
