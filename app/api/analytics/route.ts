import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAnalyticsSummary, getMostViewedProducts, getTopPages } from '@/lib/analytics'

// GET /api/analytics - Get analytics summary (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    const [summary, mostViewed, topPages] = await Promise.all([
      getAnalyticsSummary(days),
      getMostViewedProducts(10),
      getTopPages(10, days),
    ])

    return NextResponse.json({
      summary,
      mostViewed,
      topPages,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
