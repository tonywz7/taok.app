'use client'

import React from 'react'

export default function ResearchProjectList({ filter }: { filter: string }) {
  // Placeholder: will be wired to API via useResearch hook
  const projects = [
    { id: 'p-1', name: 'Market Sizing' },
    { id: 'p-2', name: 'Competitor Audit' },
  ].filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <section aria-labelledby="projects-heading">
      <h3 id="projects-heading" className="text-xs font-medium text-slate-600 mb-2">Projects</h3>
      <ul className="space-y-2">
        {projects.map(p => (
          <li key={p.id}>
            <button className="w-full text-left px-2 py-2 rounded hover:bg-slate-100">{p.name}</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
