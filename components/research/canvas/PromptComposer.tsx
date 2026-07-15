'use client'

import React, { useState } from 'react'

export default function PromptComposer({ onSubmit, disabled = false }: { onSubmit: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={(e) => { e.preventDefault(); if (!disabled && value.trim()) { onSubmit(value.trim()); setValue('') } }} className="flex gap-2">
        <label htmlFor="research-prompt" className="sr-only">Research prompt</label>
        <input
          id="research-prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="Ask something like: Map the seed VC landscape in Europe"
          className="min-w-0 flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />
        <button type="submit" disabled={disabled || !value.trim()} className="rounded-md bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">Send</button>
      </form>
      {disabled && <p className="text-xs text-slate-500">Live prompt execution is not connected in this preview. Use the citation workspace to exercise the supported interactive flow.</p>}
    </div>
  )
}
