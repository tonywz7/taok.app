'use client'

import React from 'react'
import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WorkspaceHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 h-16">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo - visible on mobile when menu closed */}
      <a href="/" className="font-display text-lg ml-2 lg:ml-0">
        Taok
      </a>

      {/* Search bar - hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-sm mx-4 items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-border">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm outline-none text-slate-600"
          disabled
        />
      </div>

      {/* Right section - profile menu */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <a href="/">Exit workspace</a>
        </Button>
      </div>
    </header>
  )
}
