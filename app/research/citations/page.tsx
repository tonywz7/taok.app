import type { Metadata } from 'next'
import { CitationWorkspace } from '@/components/research/citations/CitationWorkspace'

export const metadata: Metadata = {
  title: 'Citations & Sources · Taok',
  description:
    'Every claim Taok makes is backed by inspectable, verifiable evidence — with confidence scores, source trust ratings, and full provenance.',
}

export default function CitationsPage() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-background text-foreground">
      <CitationWorkspace className="h-full" />
    </main>
  )
}
