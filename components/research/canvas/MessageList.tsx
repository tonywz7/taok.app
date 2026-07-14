'use client'

import React from 'react'

export default function MessageList({ messages }: { messages: Array<{id:string, role:'user'|'assistant', text:string}> }) {
  return (
    <ol className="space-y-4" aria-live="polite">
      {messages.map(m => (
        <li key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
          <div className={`inline-block rounded-md p-3 ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
            {m.text}
          </div>
        </li>
      ))}
    </ol>
  )
}
