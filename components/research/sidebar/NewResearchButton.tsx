'use client'

import React from 'react'

export default function NewResearchButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1 text-sm hover:opacity-95"
      aria-label="Create new research"
    >
      + New
    </button>
  )
}
