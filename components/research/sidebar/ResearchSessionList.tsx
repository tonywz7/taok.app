'use client'

import React from 'react'

export default function ResearchSessionList({ filter }: { filter: string }) {
  const sessions = [
    { id: 's-1', title: 'Seed VC Landscape' },
    { id: 's-2', title: 'Hiring: Senior Devs' },
  ].filter(s => s.title.toLowerCase().includes(filter.toLowerCase()))

  return (
    <section aria-labelledby="sessions-heading">
      <h3 id="sessions-heading" className="text-xs font-medium text-slate-600 mb-2">Recent Sessions</h3>
      <ul className="space-y-2">
        {sessions.map(s => (
          <li key={s.id}>
            <button className="w-full text-left px-2 py-2 rounded hover:bg-slate-100">{s.title}</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
