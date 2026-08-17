import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/workspace')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <h1 className="text-3xl font-semibold">Sign in to Taok</h1>
        <p className="text-muted-foreground">Access your research workspace.</p>
      </div>
      <AuthForm mode="sign-in" />
      <p className="text-sm text-muted-foreground">New here? <Link className="underline" href="/sign-up">Create an account</Link></p>
    </main>
  )
}
