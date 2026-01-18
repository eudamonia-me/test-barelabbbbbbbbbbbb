import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import Image from 'next/image'

export default async function HomePageNew() {
  // Get trending products (most viewed recently)
  const trendingProducts = await prisma.product.findMany({
    where: { published: true },
    include: {
      tags: {
        include: { tag: true },
        where: { confidence: { gte: 0.3 } },
        orderBy: { confidence: 'desc' },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { viewCount: 'desc' },
    take: 4,
  })

  // Get products with most positive feedback
  const topRatedProducts = await prisma.product.findMany({
    where: { 
      published: true,
      comments: {
        some: {}
      }
    },
    include: {
      tags: {
        include: { tag: true },
        where: { confidence: { gte: 0.3 } },
        orderBy: { confidence: 'desc' },
      },
      _count: { select: { comments: true } },
    },
    take: 6,
  })

  // Get recently added products
  const recentProducts = await prisma.product.findMany({
    where: { published: true },
    include: {
      tags: {
        include: { tag: true },
        where: { confidence: { gte: 0.3 } },
        orderBy: { confidence: 'desc' },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  const totalComments = await prisma.comment.count()
  const totalProducts = await prisma.product.count({ where: { published: true } })

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-neutral-900 text-white">
        <div className="container py-20 md:py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-white"></div>
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                Data-Driven Beauty Reviews
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light leading-[1.1] mb-6 tracking-tight">
              Products from the<br />
              <span className="italic">inside out</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-8 max-w-2xl">
              See how cosmetics actually perform on real people's skin.
              All insights from user feedback. Zero marketing claims.
            </p>

            <div className="flex items-center gap-8 mb-12 text-sm">
              <div>
                <div className="text-4xl font-light mb-1">{totalProducts}</div>
                <div className="text-neutral-400 uppercase tracking-wide text-xs">Products Analyzed</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">{totalComments}</div>
                <div className="text-neutral-400 uppercase tracking-wide text-xs">Real Reviews</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">100%</div>
                <div className="text-neutral-400 uppercase tracking-wide text-xs">Transparent</div>
              </div>
            </div>

            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Explore All Products
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-light mb-2">Trending Now</h2>
              <p className="text-neutral-500">Most viewed products this week</p>
            </div>
            <Link 
              href="/products?sort=trending" 
              className="text-sm uppercase tracking-wider text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Most Positive Feedback Section */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-light mb-2">Top Rated by Users</h2>
              <p className="text-neutral-500">Products with the most positive feedback</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-light mb-2">Recently Added</h2>
              <p className="text-neutral-500">New products with user reviews</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-2">Browse by Category</h2>
            <p className="text-neutral-500">Discover products by type</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Foundation', icon: '💄', description: 'Base makeup' },
              { name: 'Concealer', icon: '✨', description: 'Coverage & correction' },
              { name: 'Powder', icon: '🌟', description: 'Setting & finishing' },
              { name: 'Skincare', icon: '🧴', description: 'Face care' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className="group border border-neutral-200 rounded-lg p-8 hover:bg-neutral-50 transition-colors text-center"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-light mb-2 group-hover:text-neutral-900">{category.name}</h3>
                <p className="text-sm text-neutral-500">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-neutral-100">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light mb-4">How barelab Works</h2>
              <p className="text-neutral-600">Real data. Real transparency. No marketing hype.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                  1
                </div>
                <h3 className="text-lg font-medium mb-2">Collect Real Feedback</h3>
                <p className="text-sm text-neutral-600">
                  We gather authentic user reviews from social platforms and direct submissions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                  2
                </div>
                <h3 className="text-lg font-medium mb-2">Analyze with Data</h3>
                <p className="text-sm text-neutral-600">
                  Comments are analyzed for performance patterns, skin type fit, and real-world behavior.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light">
                  3
                </div>
                <h3 className="text-lg font-medium mb-2">Show the Truth</h3>
                <p className="text-sm text-neutral-600">
                  You see probability-based insights and raw data, never marketing claims.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/about" 
                className="inline-flex items-center px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-white transition-colors text-sm uppercase tracking-wider"
              >
                Learn More About Our Method
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why barelab is Different */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-12">Why We're Different</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">❌</div>
                <div>
                  <h3 className="font-medium mb-2">No Sponsored Content</h3>
                  <p className="text-sm text-neutral-600">
                    We don't accept payment from brands. Every insight comes from real users.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">❌</div>
                <div>
                  <h3 className="font-medium mb-2">No Absolute Claims</h3>
                  <p className="text-sm text-neutral-600">
                    We never say "this is good for dry skin." We show percentages and user data.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✅</div>
                <div>
                  <h3 className="font-medium mb-2">Full Transparency</h3>
                  <p className="text-sm text-neutral-600">
                    See raw comments, data sources, and confidence levels for every insight.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">✅</div>
                <div>
                  <h3 className="font-medium mb-2">Real User Data</h3>
                  <p className="text-sm text-neutral-600">
                    All ratings and insights calculated from actual user experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-neutral-900 text-white">
        <div className="container py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">Ready to see the data?</h2>
            <p className="text-neutral-300 mb-8 text-lg leading-relaxed">
              Browse our collection of cosmetics analyzed through real user feedback.
              No marketing. No hype. Just transparent data.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
