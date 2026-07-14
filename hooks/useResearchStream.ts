'use client'

import { useEffect, useRef, useState } from 'react'
import { ResearchStreamStatus, StreamStage } from '../types/research'

export function useResearchStream(endpoint: string) {
  const [status, setStatus] = useState<ResearchStreamStatus>({ stage: 'Planning', progress: 0 })
  const controllerRef = useRef<AbortController | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)

  useEffect(() => {
    controllerRef.current = new AbortController()
    const signal = controllerRef.current.signal

    let cancelled = false

    async function connect() {
      try {
        const res = await fetch(endpoint, { signal })
        if (!res.body) return
        readerRef.current = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await readerRef.current.read()
          if (done) break
          const chunk = decoder.decode(value)
          // naive protocol: stage JSON per line
          chunk.split('\n').forEach(line => {
            if (!line.trim()) return
            try {
              const obj = JSON.parse(line)
              if (obj.stage) setStatus(prev => ({ ...prev, stage: obj.stage }))
              if (typeof obj.progress === 'number') setStatus(prev => ({ ...prev, progress: obj.progress }))
            } catch (e) {
              // ignore non-json
            }
          })
          if (cancelled) break
        }
        if (!cancelled) setStatus(prev => ({ ...prev, stage: 'Completed', progress: 1 }))
      } catch (e) {
        // network or aborted
        setStatus(prev => ({ ...prev, stage: 'Completed' }))
      }
    }

    connect()

    return () => {
      cancelled = true
      controllerRef.current?.abort()
      readerRef.current?.cancel().catch(() => {})
    }
  }, [endpoint])

  return { status, abort: () => controllerRef.current?.abort() }
}
