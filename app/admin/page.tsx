import { prisma } from '@/lib/prisma'
import { getAnalyticsSummary, getMostViewedProducts } from '@/lib/analytics'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [productsCount, commentsCount, tagsCount, analytics, mostViewed] = await Promise.all([
    prisma.product.count(),
    prisma.comment.count(),
    prisma.tag.count(),
    getAnalyticsSummary(30),
    getMostViewedProducts(5),
  ])

  const recentComments = await prisma.comment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { name: true, brand: true },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light mb-2">Dashboard</h1>
        <p className="text-neutral-600">Overview of your barelab platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <div className="text-3xl font-light mb-2">{productsCount}</div>
          <div className="text-sm text-neutral-600">Total Products</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{commentsCount}</div>
          <div className="text-sm text-neutral-600">User Comments</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{tagsCount}</div>
          <div className="text-sm text-neutral-600">Tag Types</div>
        </Card>
        <Card>
          <div className="text-3xl font-light mb-2">{analytics.totalViews}</div>
          <div className="text-sm text-neutral-600">Total Views (30d)</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Most Viewed Products */}
        <Card>
          <h2 className="text-xl font-light mb-4">Most Viewed Products</h2>
          <div className="space-y-3">
            {mostViewed.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-neutral-500">{product.brand}</div>
                </div>
                <div className="text-sm text-neutral-600">{product.viewCount} views</div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/analytics"
            className="block mt-4 text-sm text-neutral-600 hover:text-neutral-900 text-center"
          >
            View all analytics →
          </Link>
        </Card>

        {/* Recent Comments */}
        <Card>
          <h2 className="text-xl font-light mb-4">Recent Comments</h2>
          <div className="space-y-3">
            {recentComments.map((comment) => (
              <div
                key={comment.id}
                className="py-2 border-b border-neutral-100 last:border-0"
              >
                <div className="text-xs text-neutral-500 mb-1">
                  {comment.product.brand} - {comment.product.name}
                </div>
                <div className="text-sm text-neutral-700 line-clamp-2">
                  {comment.text}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/comments"
            className="block mt-4 text-sm text-neutral-600 hover:text-neutral-900 text-center"
          >
            View all comments →
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-light mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products?action=new" className="btn-primary text-center">
            Add Product
          </Link>
          <Link href="/admin/comments?action=new" className="btn-secondary text-center">
            Add Comment
          </Link>
          <Link href="/admin/tags" className="btn-outline text-center">
            Manage Tags
          </Link>
          <Link href="/admin/settings" className="btn-outline text-center">
            Site Settings
          </Link>
        </div>
      </Card>
    </div>
  )
}
