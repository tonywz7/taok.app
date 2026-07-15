import React from 'react'

export const metadata = {
  title: 'Dashboard - Taok Workspace',
  description: 'Your TAOK workspace dashboard',
}

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600">
          Welcome to your Taok workspace. Authentication and personalized data coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-900">Companies</h3>
          <p className="text-2xl font-bold mt-2">—</p>
          <p className="text-xs text-slate-500 mt-1">in your workspace</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-900">People</h3>
          <p className="text-2xl font-bold mt-2">—</p>
          <p className="text-xs text-slate-500 mt-1">decision makers tracked</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-medium text-slate-900">Research Sessions</h3>
          <p className="text-2xl font-bold mt-2">—</p>
          <p className="text-xs text-slate-500 mt-1">research projects</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-6 bg-slate-50 text-center">
        <p className="text-slate-600">Dashboard metrics will appear once authentication is implemented.</p>
      </div>
    </div>
  )
}
