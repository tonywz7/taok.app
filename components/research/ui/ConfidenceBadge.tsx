import React from 'react'

export function ConfidenceBadge({ level, value }: { level: 'Verified'|'High'|'Medium'|'Low'|'Needs Review', value?: number }) {
  const color = level === 'Verified' ? 'bg-green-600' : level === 'High' ? 'bg-emerald-500' : level === 'Medium' ? 'bg-amber-500' : level === 'Low' ? 'bg-rose-500' : 'bg-slate-500'
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded ${color}`} aria-hidden>
      {level}{typeof value === 'number' ? ` ${Math.round(value * 100)}%` : ''}
    </span>
  )
}

export default ConfidenceBadge
