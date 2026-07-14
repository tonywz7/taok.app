'use client'

import React, { useState } from 'react'

export default function PromptComposer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (value.trim()) { onSubmit(value.trim()); setValue('') } }} className="flex gap-2">
      <label className="sr-only">Prompt</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask something like: 'Map the seed VC landscape in Europe'" className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-300" />
      <button type="submit" className="px-3 py-2 bg-slate-900 text-white rounded-md">Send</button>
    </form>
  )
}
