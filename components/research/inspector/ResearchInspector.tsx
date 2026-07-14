'use client'

import React from 'react'

export default function ResearchInspector() {
  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold">Inspector</h2>
      <div className="mt-4 text-sm text-slate-600">Select an item to see details</div>

      <div className="mt-6 space-y-4">
        <section>
          <h3 className="text-xs font-medium text-slate-600">Overview</h3>
          <p className="mt-2 text-sm text-slate-700">No selection</p>
        </section>

        <section>
          <h3 className="text-xs font-medium text-slate-600">Sources</h3>
          <p className="mt-2 text-sm text-slate-700">—</p>
        </section>
      </div>
    </div>
  )
}
