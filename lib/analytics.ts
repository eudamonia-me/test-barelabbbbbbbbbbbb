// Analytics utilities for tracking user behavior

import { prisma } from './prisma'

/**
 * Track a page view
 */
export async function trackPageView(
  path: string,
  productId?: string,
  referrer?: string,
  userAgent?: string
) {
  try {
    await prisma.pageView.create({
      data: {
        path,
        productId,
        referrer,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

/**
 * Increment product view count
 */
export async function incrementProductViewCount(productId: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error('Failed to increment product view count:', error)
  }
}

/**
 * Get most viewed products
 */
export async function getMostViewedProducts(limit: number = 10) {
  return await prisma.product.findMany({
    orderBy: {
      viewCount: 'desc',
    },
    take: limit,
    select: {
      id: true,
      name: true,
      brand: true,
      viewCount: true,
      imageUrl: true,
    },
  })
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [totalViews, productViews, recentProducts] = await Promise.all([
    prisma.pageView.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    }),
    prisma.pageView.count({
      where: {
        productId: {
          not: null,
        },
        createdAt: {
          gte: since,
        },
      },
    }),
    prisma.product.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    }),
  ])

  return {
    totalViews,
    productViews,
    recentProducts,
    period: days,
  }
}

/**
 * Get top pages by path
 */
export async function getTopPages(limit: number = 10, days: number = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const views = await prisma.pageView.groupBy({
    by: ['path'],
    where: {
      createdAt: {
        gte: since,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: limit,
  })

  return views.map((view) => ({
    path: view.path,
    views: view._count.id,
  }))
}
