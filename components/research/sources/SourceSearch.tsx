'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SourceSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Accessible search field for filtering sources by text. */
function SourceSearchImpl({ value, onChange, placeholder = 'Search sources…', className }: SourceSearchProps) {
  const id = React.useId()
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        Search sources
      </label>
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border bg-card pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  )
}

export const SourceSearch = React.memo(SourceSearchImpl)
export default SourceSearch
