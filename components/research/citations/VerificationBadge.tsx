'use client'

import React from 'react'
import { BadgeCheck, CheckCheck, Circle, CircleHelp, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { VerificationStatus } from '@/types/citations'
import { verificationMeta } from '@/packages/research/citations'
import { TONE_BADGE } from './styles'

const ICONS: Record<VerificationStatus, React.ComponentType<{ className?: string }>> = {
  verified: BadgeCheck,
  cross_checked: CheckCheck,
  single_source: Circle,
  unverified: CircleHelp,
  conflicting: TriangleAlert,
}

export interface VerificationBadgeProps {
  status: VerificationStatus
  size?: 'sm' | 'md'
  /** Hide the text label, showing only the icon (still accessible). */
  iconOnly?: boolean
  className?: string
}

function VerificationBadgeImpl({ status, size = 'md', iconOnly = false, className }: VerificationBadgeProps) {
  const meta = verificationMeta(status)
  const Icon = ICONS[status]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border font-medium',
            TONE_BADGE[meta.tone],
            size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs',
            className,
          )}
        >
          <Icon className={cn(size === 'sm' ? 'size-3' : 'size-3.5')} aria-hidden />
          {iconOnly ? <span className="sr-only">{meta.label}</span> : <span>{meta.label}</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-pretty">{meta.description}</TooltipContent>
    </Tooltip>
  )
}

export const VerificationBadge = React.memo(VerificationBadgeImpl)
export default VerificationBadge
