'use client'

import React from 'react'

export default function ResearchFavorites() {
  return (
    <section aria-labelledby="favorites-heading">
      <h3 id="favorites-heading" className="text-xs font-medium text-slate-600 mb-2">Favorites</h3>
      <div className="flex flex-col gap-2">
        <button className="text-left px-2 py-1 rounded hover:bg-slate-100">Competitive Analysis</button>
      </div>
    </section>
  )
}
