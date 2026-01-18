'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?days=${period}`)
      const data = await res.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Analytics</h1>
          <p className="text-neutral-600">Platform usage and insights</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-sm text-sm ${
                period === days
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-light mb-2">{analytics.summary.totalViews}</div>
          <div className="text-sm text-neutral-600">Total Page Views</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{analytics.summary.productViews}</div>
          <div className="text-sm text-neutral-600">Product Views</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{analytics.summary.recentProducts}</div>
          <div className="text-sm text-neutral-600">New Products</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{period}</div>
          <div className="text-sm text-neutral-600">Day Period</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-light mb-4">Most Viewed Products</h2>
          <div className="space-y-3">
            {analytics.mostViewed.map((product: any, index: number) => (
              <div
                key={product.id}
                className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0"
              >
                <div className="text-2xl font-light text-neutral-400 w-8">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-neutral-500">{product.brand}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{product.viewCount}</div>
                  <div className="text-xs text-neutral-500">views</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-light mb-4">Top Pages</h2>
          <div className="space-y-3">
            {analytics.topPages.map((page: any, index: number) => (
              <div
                key={page.path}
                className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0"
              >
                <div className="text-2xl font-light text-neutral-400 w-8">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono">{page.path}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{page.views}</div>
                  <div className="text-xs text-neutral-500">views</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-neutral-50">
        <h2 className="text-xl font-light mb-4">Analytics Notes</h2>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex gap-2">
            <span>•</span>
            <span>Page views are tracked automatically for all public pages</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Product view counts increment each time a product page is visited</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Analytics data is stored in the database and never shared with third parties</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>No personal user data is collected or tracked</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
