import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { getAllContactSubmissions, getContactStats } from '@/lib/contact-db'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await validateAdminSession(sessionToken)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get('stats') === 'true'

    if (statsOnly) {
      const stats = await getContactStats()
      return NextResponse.json(stats)
    }

    const submissions = await getAllContactSubmissions()
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}

