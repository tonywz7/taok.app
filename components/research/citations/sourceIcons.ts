import type * as React from 'react'
import {
  Building2,
  Database,
  FileText,
  Github,
  Globe,
  Newspaper,
  UserRound,
  Waypoints,
} from 'lucide-react'
import type { SourceType } from '@/types/citations'

/** Lucide icon per source type, used across previews and filters. */
export const SOURCE_TYPE_ICON: Record<SourceType, React.ComponentType<{ className?: string }>> = {
  web_article: Globe,
  company_database: Building2,
  social_signal: Waypoints,
  github: Github,
  news: Newspaper,
  research_paper: FileText,
  internal_data: Database,
  user_provided: UserRound,
}
