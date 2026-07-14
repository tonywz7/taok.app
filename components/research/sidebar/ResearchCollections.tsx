'use client'

import React from 'react'

export default function ResearchCollections() {
  return (
    <section aria-labelledby="collections-heading">
      <h3 id="collections-heading" className="text-xs font-medium text-slate-600 mb-2">Collections</h3>
      <div className="flex flex-col gap-2">
        <button className="text-left px-2 py-1 rounded hover:bg-slate-100">Product Research</button>
      </div>
    </section>
  )
}
