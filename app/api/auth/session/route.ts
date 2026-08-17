import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth/session'

export async function GET() {
  try {
    const session = await getCurrentSession()
    return NextResponse.json({ success: true, data: { user: session?.user ?? null } })
  } catch (error) {
    console.error('[GET /api/auth/session]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Session unavailable' } },
      { status: 500 },
    )
  }
}
