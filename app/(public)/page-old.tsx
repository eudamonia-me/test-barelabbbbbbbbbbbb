import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

export default async function HomePage() {
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
    orderBy: { viewCount: 'desc' },
    take: 8,
  })

  const totalComments = await prisma.comment.count()
  const totalProducts = await prisma.product.count({ where: { published: true } })

  return (
    <div>
      {/* Hero Section - Editorial Style */}
      <div className="border-b border-neutral-200">
        <div className="container py-20 md:py-32">
          <div className="max-w-4xl">
            {/* Overline */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-neutral-900"></div>
              <span className="text-xs uppercase tracking-widest text-neutral-500">
                No Hype. Just Data.
              </span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-6xl md:text-7xl font-light leading-[1.1] mb-8 tracking-tight">
              See cosmetics<br />
              from the <span className="italic">inside out</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-12 max-w-2xl">
              Real product insights based on how they actually behave on real people's skin.
              <span className="block mt-2 text-lg text-neutral-500">
                All data from user feedback. Zero marketing claims.
              </span>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-12 text-sm">
              <div>
                <div className="text-3xl font-light mb-1">{totalProducts}</div>
                <div className="text-neutral-500 uppercase tracking-wide text-xs">Products Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1">{totalComments}</div>
                <div className="text-neutral-500 uppercase tracking-wide text-xs">User Comments</div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1">50+</div>
                <div className="text-neutral-500 uppercase tracking-wide text-xs">Data Points</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products" 
                className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wider"
              >
                Explore Products
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/about" 
                className="inline-flex items-center px-8 py-4 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm uppercase tracking-wider"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="container py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-12 text-center">
              Our Approach
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-6xl font-light text-neutral-300">01</div>
                <h3 className="text-2xl font-light">User Feedback Only</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Every insight is derived from real user comments collected from social platforms 
                  and direct submissions. No brand partnerships. No sponsored content.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-6xl font-light text-neutral-300">02</div>
                <h3 className="text-2xl font-light">Probability-Based</h3>
                <p className="text-neutral-600 leading-relaxed">
                  We never say "this product is good for dry skin." Instead: "67% of users with 
                  dry skin report positive experiences." See the difference?
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-6xl font-light text-neutral-300">03</div>
                <h3 className="text-2xl font-light">Fully Transparent</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Raw comments are always visible. Data sources are always cited. Confidence 
                  levels are always shown. Nothing is hidden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="border-b border-neutral-200">
        <div className="container py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-light mb-2">Most Reviewed Products</h2>
              <p className="text-neutral-500">Real insights from real users</p>
            </div>
            <Link 
              href="/products" 
              className="text-sm uppercase tracking-wider text-neutral-600 hover:text-neutral-900 flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-neutral-200">
        <div className="container py-20">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-12 text-center">
            Browse by Category
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 max-w-6xl mx-auto border border-neutral-200">
            {[
              { name: 'Foundation', count: 'Base' },
              { name: 'Concealer', count: 'Coverage' },
              { name: 'Powder', count: 'Setting' },
              { name: 'Primer', count: 'Prep' }
            ].map((category, idx) => (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
                className={`
                  relative p-8 hover:bg-neutral-50 transition-colors group
                  ${idx % 2 === 1 ? 'border-l border-neutral-200' : ''}
                  ${idx >= 2 ? 'border-t border-neutral-200' : ''}
                `}
              >
                <div className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
                  {category.count}
                </div>
                <h3 className="text-2xl font-light mb-4">{category.name}</h3>
                <div className="text-neutral-500 group-hover:text-neutral-900 transition-colors flex items-center gap-2">
                  <span className="text-sm">Explore</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-neutral-900 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400 mb-12 text-center">
              How barelab Works
            </h2>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="text-5xl font-light text-neutral-600 flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-light mb-2">We Collect User Comments</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Real feedback from social media, forums, and direct user submissions. All anonymized for privacy.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="text-5xl font-light text-neutral-600 flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-light mb-2">We Extract Structured Data</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Comments are analyzed for skin type, finish, coverage, longevity, and 50+ other attributes.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="text-5xl font-light text-neutral-600 flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-light mb-2">We Show You the Insights</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Probability-based visualizations show you how products actually perform. No marketing spin.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/about" 
                className="inline-flex items-center text-sm uppercase tracking-wider text-white border border-white px-8 py-4 hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Learn More About Our Method
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-b border-neutral-200">
        <div className="container py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">Ready to see the data?</h2>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Browse our collection of cosmetics products analyzed through real user feedback. 
              No marketing claims. No sponsored rankings. Just transparent data.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wider"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
