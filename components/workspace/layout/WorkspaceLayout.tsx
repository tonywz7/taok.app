'use client'

import React, { useState } from 'react'
import WorkspaceHeader from '../header/WorkspaceHeader'
import WorkspaceSidebar from '../sidebar/WorkspaceSidebar'

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <WorkspaceSidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full bg-card border-r border-border overflow-auto">
          <WorkspaceSidebar />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <WorkspaceHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
