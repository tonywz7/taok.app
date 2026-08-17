'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })

    if (result.error) {
      setError('Authentication failed. Please check your details and try again.')
      setLoading(false)
      return
    }

    router.push('/workspace')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-4">
      {isSignUp && (
        <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
      )}
      <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
      <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={loading} type="submit">
        {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}
