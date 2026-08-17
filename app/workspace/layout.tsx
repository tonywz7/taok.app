import { redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth/session'
import WorkspaceLayout from '@/components/workspace/layout/WorkspaceLayout'

export const metadata = {
  title: 'Workspace - Taok',
  description: 'TAOK Workspace - Manage your research, companies, and team',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession()
  if (!session?.user) {
    redirect('/sign-in')
  }

  return <WorkspaceLayout>{children}</WorkspaceLayout>
}
