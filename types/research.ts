export type StreamStage =
  | 'Planning'
  | 'Searching'
  | 'Reading'
  | 'Extracting'
  | 'Reasoning'
  | 'Ranking'
  | 'Writing'
  | 'Completed'

export type ResearchStreamStatus = {
  stage: StreamStage
  progress: number // 0..1
  startedAt?: string
  updatedAt?: string
}

export type ResearchSource = {
  id: string
  url: string
  title: string
  snippet?: string
  trust?: number
  favicon?: string
  updatedAt?: string
  type?: 'article'|'web'|'pdf'|'other'
}
