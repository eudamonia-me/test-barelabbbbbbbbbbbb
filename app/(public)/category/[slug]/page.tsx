import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'
import Card from '@/components/ui/Card'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    skinType?: string
    finish?: string
    coverage?: string
    issue?: string
    hasSPF?: string
    hasAlcohol?: string
  }>
}

const CATEGORIES = ['foundation', 'concealer', 'powder', 'primer', 'blush', 'bronzer']

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  
  if (!CATEGORIES.includes(params.slug)) {
    notFound()
  }

  // Build filter conditions
  const where: any = {
    published: true,
    category: params.slug,
  }

  // Tag-based filters
  const tagFilters: string[] = []
  
  if (searchParams.skinType) {
    tagFilters.push(`skin_type_${searchParams.skinType}`)
  }
  
  if (searchParams.finish) {
    tagFilters.push(`finish_${searchParams.finish}`)
  }
  
  if (searchParams.coverage) {
    tagFilters.push(`coverage_${searchParams.coverage}`)
  }

  if (searchParams.issue === 'no_oxidation') {
    tagFilters.push('issue_no_oxidation')
  }

  if (searchParams.issue === 'oil_control') {
    tagFilters.push('property_oil_control')
  }

  if (tagFilters.length > 0) {
    where.tags = {
      some: {
        tag: { key: { in: tagFilters } },
        confidence: { gte: 0.3 },
      },
    }
  }

  // Formula-based filters
  if (searchParams.hasSPF === 'true') {
    where.hasSPF = true
  }

  if (searchParams.hasAlcohol === 'false') {
    where.hasAlcohol = false
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      tags: {
        include: { tag: true },
        where: { confidence: { gte: 0.3 } },
        orderBy: { confidence: 'desc' },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { viewCount: 'desc' },
  })

  // Build current filter display
  const activeFilters = []
  if (searchParams.skinType) activeFilters.push({ key: 'skinType', label: `${searchParams.skinType} skin` })
  if (searchParams.finish) activeFilters.push({ key: 'finish', label: `${searchParams.finish} finish` })
  if (searchParams.coverage) activeFilters.push({ key: 'coverage', label: `${searchParams.coverage} coverage` })
  if (searchParams.issue) activeFilters.push({ key: 'issue', label: searchParams.issue.replace('_', ' ') })
  if (searchParams.hasSPF === 'true') activeFilters.push({ key: 'hasSPF', label: 'has SPF' })
  if (searchParams.hasAlcohol === 'false') activeFilters.push({ key: 'hasAlcohol', label: 'alcohol-free' })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-4 capitalize">{params.slug}</h1>
        <p className="text-neutral-600">
          {products.length} product{products.length !== 1 ? 's' : ''} with real user feedback
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-medium mb-4">Filters</h3>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <div className="text-sm font-medium mb-2">Active:</div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <a
                      key={filter.key}
                      href={`/category/${params.slug}`}
                      className="text-xs bg-neutral-900 text-white px-2 py-1 rounded-full hover:bg-neutral-700"
                    >
                      {filter.label} ×
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Skin Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Skin Type</h4>
              <div className="space-y-2">
                {['dry', 'oily', 'combination', 'normal', 'sensitive'].map((type) => (
                  <a
                    key={type}
                    href={`/category/${params.slug}?skinType=${type}`}
                    className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                      searchParams.skinType === type ? 'bg-neutral-100 font-medium' : ''
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            {/* Finish Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Finish</h4>
              <div className="space-y-2">
                {['matte', 'dewy', 'satin', 'natural'].map((finish) => (
                  <a
                    key={finish}
                    href={`/category/${params.slug}?finish=${finish}`}
                    className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                      searchParams.finish === finish ? 'bg-neutral-100 font-medium' : ''
                    }`}
                  >
                    {finish.charAt(0).toUpperCase() + finish.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            {/* Coverage Filter */}
            {(params.slug === 'foundation' || params.slug === 'concealer') && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Coverage</h4>
                <div className="space-y-2">
                  {['sheer', 'light', 'medium', 'full'].map((coverage) => (
                    <a
                      key={coverage}
                      href={`/category/${params.slug}?coverage=${coverage}`}
                      className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                        searchParams.coverage === coverage ? 'bg-neutral-100 font-medium' : ''
                      }`}
                    >
                      {coverage.charAt(0).toUpperCase() + coverage.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Common Issues */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Properties</h4>
              <div className="space-y-2">
                <a
                  href={`/category/${params.slug}?issue=no_oxidation`}
                  className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                    searchParams.issue === 'no_oxidation' ? 'bg-neutral-100 font-medium' : ''
                  }`}
                >
                  No Oxidation
                </a>
                <a
                  href={`/category/${params.slug}?issue=oil_control`}
                  className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                    searchParams.issue === 'oil_control' ? 'bg-neutral-100 font-medium' : ''
                  }`}
                >
                  Oil Control
                </a>
              </div>
            </div>

            {/* Formula Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Formula</h4>
              <div className="space-y-2">
                <a
                  href={`/category/${params.slug}?hasSPF=true`}
                  className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                    searchParams.hasSPF === 'true' ? 'bg-neutral-100 font-medium' : ''
                  }`}
                >
                  Has SPF
                </a>
                <a
                  href={`/category/${params.slug}?hasAlcohol=false`}
                  className={`block text-sm py-1 px-2 rounded hover:bg-neutral-100 ${
                    searchParams.hasAlcohol === 'false' ? 'bg-neutral-100 font-medium' : ''
                  }`}
                >
                  Alcohol-Free
                </a>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <a
                href={`/category/${params.slug}`}
                className="block text-center text-sm text-neutral-600 hover:text-neutral-900 underline"
              >
                Clear all filters
              </a>
            )}
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-16">
                <p className="text-neutral-500 mb-4">No products match your filters</p>
                <a
                  href={`/category/${params.slug}`}
                  className="text-sm text-neutral-700 hover:text-neutral-900 underline"
                >
                  Clear filters
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
