'use client'

import { useEffect, useState, useRef } from 'react'
import { ResearchStreamStatus, StreamStage } from '../types/research'

export function useResearch(sessionId?: string) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current = new AbortController()
    setLoading(true)
    fetch(`/api/research/${sessionId ?? ''}`, { signal: abortRef.current.signal })
      .then(res => { if (!res.ok) throw new Error('Network') ; return res.json() })
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => abortRef.current?.abort()
  }, [sessionId])

  return { data, loading, reload: () => {/* TODO: could implement */} }
}
