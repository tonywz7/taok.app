'use client'

import React, { useMemo, useState, useEffect } from 'react'
import ResearchProjectList from './ResearchProjectList'
import ResearchSessionList from './ResearchSessionList'
import ResearchFavorites from './ResearchFavorites'
import ResearchCollections from './ResearchCollections'
import NewResearchButton from './NewResearchButton'
import SearchInput from './SearchInput'

export default function ResearchSidebar() {
  const [query, setQuery] = useState('')

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Research</h2>
        <NewResearchButton />
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search sessions" />

      <div className="mt-4 space-y-4">
        <ResearchFavorites />
        <ResearchProjectList filter={query} />
        <ResearchSessionList filter={query} />
        <ResearchCollections />
      </div>
    </div>
  )
}
