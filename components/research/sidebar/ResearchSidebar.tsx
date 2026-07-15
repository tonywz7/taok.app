'use client'

import React from 'react'

export default function ResearchSidebar() {
  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold">Research tools</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Review the citation demo or return to the product overview. Saved projects and sessions are not available in this preview.
      </p>
      <nav aria-label="Research tools" className="mt-4 flex flex-col gap-2">
        <a href="/research/citations" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Open citation workspace
        </a>
        <a href="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          Product overview
        </a>
      </nav>
    </div>
  )
}
