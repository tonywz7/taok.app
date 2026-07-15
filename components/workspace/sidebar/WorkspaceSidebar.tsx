'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, Users, Settings, HelpCircle } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/workspace', icon: LayoutGrid },
  { label: 'Research', href: '/research', icon: FileText },
  { label: 'Team', href: '/workspace/team', icon: Users },
]

const footerItems = [
  { label: 'Settings', href: '/workspace/settings', icon: Settings },
  { label: 'Help', href: '/workspace/help', icon: HelpCircle },
]

export default function WorkspaceSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/workspace') {
      return pathname === '/workspace'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <a href="/" className="font-display text-lg text-slate-900">
          Taok
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer items */}
      <nav className="px-2 py-4 border-t border-border space-y-1">
        {footerItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
