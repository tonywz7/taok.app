import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/workspace')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <h1 className="text-3xl font-semibold">Create your Taok account</h1>
        <p className="text-muted-foreground">Your first workspace will be created automatically.</p>
      </div>
      <AuthForm mode="sign-up" />
      <p className="text-sm text-muted-foreground">Already have an account? <Link className="underline" href="/sign-in">Sign in</Link></p>
    </main>
  )
}
