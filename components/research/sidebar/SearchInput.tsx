'use client'

import React from 'react'

export default function SearchInput({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search</span>
      <input
        aria-label="Search research"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  )
}
