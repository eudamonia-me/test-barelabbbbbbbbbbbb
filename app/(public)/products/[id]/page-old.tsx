import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { incrementProductViewCount } from '@/lib/analytics'
import { calculateSkinTypeScale, getTagDefinition } from '@/lib/tags'
import Disclaimer from '@/components/ui/Disclaimer'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import SkinTypeScale from '@/components/visualizations/SkinTypeScale'
import PropertyIndicator from '@/components/visualizations/PropertyIndicator'
import ConfidenceBar from '@/components/visualizations/ConfidenceBar'
import CommentCard from '@/components/product/CommentCard'
import TagChart from '@/components/visualizations/TagChart'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ view?: string }>
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const product = await prisma.product.findUnique({
    where: { id: params.id, published: true },
    include: {
      tags: {
        include: { tag: true },
        orderBy: { confidence: 'desc' },
      },
      comments: {
        include: {
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // Track view (fire and forget)
  incrementProductViewCount(product.id)

  const view = searchParams.view || 'overview'
  const totalComments = product.comments.length

  // Calculate aggregated data
  const tagsMap = new Map(
    product.tags.map((pt) => [pt.tag.key, { count: pt.count, confidence: pt.confidence }])
  )

  // Skin type data
  const dryTag = tagsMap.get('skin_type_dry')
  const oilyTag = tagsMap.get('skin_type_oily')
  const comboTag = tagsMap.get('skin_type_combination')
  const skinTypeScale = calculateSkinTypeScale(tagsMap)

  // Get finish tags
  const finishTags = product.tags.filter(pt => pt.tag.category === 'finish')
  const topFinish = finishTags[0]

  // Get coverage tags
  const coverageTags = product.tags.filter(pt => pt.tag.category === 'coverage')
  const topCoverage = coverageTags[0]

  // Get issue tags
  const issueTags = product.tags.filter(pt => pt.tag.category === 'issue')
  
  // Get property tags
  const propertyTags = product.tags.filter(pt => pt.tag.category === 'property')

  // Get longevity tags
  const longevityTags = product.tags.filter(pt => pt.tag.category === 'longevity')
  const topLongevity = longevityTags[0]

  return (
    <div>
      {/* Product Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="py-4 text-xs uppercase tracking-wider text-neutral-500">
            <a href="/products" className="hover:text-neutral-900">Products</a>
            <span className="mx-2">/</span>
            <a href={`/category/${product.category}`} className="hover:text-neutral-900">{product.category}</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </div>
          
          {/* Navigation tabs */}
          <div className="flex gap-8">
            <a
              href={`/products/${product.id}?view=overview`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                view === 'overview'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Overview
            </a>
            <a
              href={`/products/${product.id}?view=feedback`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                view === 'feedback'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              User Feedback
            </a>
            <a
              href={`/products/${product.id}?view=data`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                view === 'data'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Data & Insights
            </a>
          </div>
        </div>
      </div>

      {/* Overview View */}
      {view === 'overview' && (
        <div className="container py-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Image */}
            <div>
              <div className="sticky top-32">
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      No image available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
                    {product.brand}
                  </div>
                  <h1 className="text-5xl font-light mb-4 leading-tight">{product.name}</h1>
                  <div className="flex items-center gap-3">
                    <Badge>{product.category}</Badge>
                    {product.hasSPF && (
                      <Badge variant="success">SPF {product.spfValue}</Badge>
                    )}
                  </div>
                </div>

                {product.price && (
                  <div className="border-t border-b border-neutral-200 py-6">
                    <div className="text-3xl font-light">
                      {product.currency} {product.price.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Data Badge */}
                <div className="bg-neutral-50 border border-neutral-200 p-6">
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
                    Based on Real Data
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="text-2xl font-light mb-1">{totalComments}</div>
                      <div className="text-neutral-600">User Comments</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light mb-1">{product.tags.length}</div>
                      <div className="text-neutral-600">Attributes</div>
                    </div>
                  </div>
                </div>

                <Disclaimer />

                {product.description && (
                  <div className="prose prose-neutral">
                    <p className="text-neutral-700 leading-relaxed text-lg">{product.description}</p>
                  </div>
                )}

                {/* Key Properties */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500">Key Properties</h3>
                  
                  <div className="space-y-4">
                    {topFinish && (
                      <div className="border-l-2 border-neutral-900 pl-4">
                        <div className="text-sm font-medium mb-1">Finish</div>
                        <div className="text-neutral-600 text-sm">
                          Most users report {topFinish.tag.label.toLowerCase()} ({Math.round(topFinish.confidence * 100)}%)
                        </div>
                      </div>
                    )}
                    
                    {topCoverage && (
                      <div className="border-l-2 border-neutral-900 pl-4">
                        <div className="text-sm font-medium mb-1">Coverage</div>
                        <div className="text-neutral-600 text-sm">
                          Often described as {topCoverage.tag.label.toLowerCase()} ({Math.round(topCoverage.confidence * 100)}%)
                        </div>
                      </div>
                    )}
                    
                    {topLongevity && (
                      <div className="border-l-2 border-neutral-900 pl-4">
                        <div className="text-sm font-medium mb-1">Longevity</div>
                        <div className="text-neutral-600 text-sm">
                          {topLongevity.tag.label} ({Math.round(topLongevity.confidence * 100)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skin Type Suitability */}
                <div className="border-t border-neutral-200 pt-8">
                  <SkinTypeScale
                    value={skinTypeScale}
                    dryCount={dryTag ? Math.round(dryTag.confidence * totalComments) : 0}
                    oilyCount={oilyTag ? Math.round(oilyTag.confidence * totalComments) : 0}
                    comboCount={comboTag ? Math.round(comboTag.confidence * totalComments) : 0}
                    totalComments={totalComments}
                  />
                </div>

                {/* Top Tags */}
                <div className="border-t border-neutral-200 pt-8">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                    Most Mentioned Attributes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.filter(t => t.confidence > 0.2).slice(0, 8).map((pt) => (
                      <div key={pt.tag.key} className="bg-neutral-100 px-3 py-2 text-sm">
                        {pt.tag.label}
                        <span className="text-neutral-500 ml-2">
                          {Math.round(pt.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback View */}
      {view === 'feedback' && (
        <div className="container py-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-4xl font-light mb-4">User Feedback</h2>
              <p className="text-neutral-600">
                {totalComments} user {totalComments === 1 ? 'comment' : 'comments'} • All feedback is anonymized for privacy
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main: Comments */}
              <div className="lg:col-span-2 space-y-8">
                {product.comments.length > 0 ? (
                  <>
                    {product.comments.map((comment) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </>
                ) : (
                  <div className="border border-neutral-200 p-12 text-center">
                    <p className="text-neutral-500">No user comments yet</p>
                  </div>
                )}
              </div>

              {/* Sidebar: Insights */}
              <div className="space-y-8">
                {/* Most Mentioned */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                    Most Mentioned (Positive)
                  </h3>
                  <div className="space-y-4">
                    {propertyTags.filter(t => t.confidence > 0.2).slice(0, 5).map((pt) => (
                      <ConfidenceBar
                        key={pt.tag.key}
                        label={pt.tag.label}
                        confidence={pt.confidence}
                        count={pt.count}
                        totalComments={totalComments}
                      />
                    ))}
                  </div>
                </div>

                {/* Common Issues */}
                <div className="border-t border-neutral-200 pt-8">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                    Common Issues
                  </h3>
                  <div className="space-y-4">
                    {issueTags.filter(t => t.confidence > 0.15 && !t.tag.key.includes('no_')).slice(0, 5).map((pt) => (
                      <ConfidenceBar
                        key={pt.tag.key}
                        label={pt.tag.label}
                        confidence={pt.confidence}
                        count={pt.count}
                        totalComments={totalComments}
                      />
                    ))}
                    {issueTags.filter(t => !t.tag.key.includes('no_')).length === 0 && (
                      <p className="text-sm text-neutral-500">No significant issues reported</p>
                    )}
                  </div>
                </div>

                {/* Ingredients */}
                {product.ingredients && (
                  <div className="border-t border-neutral-200 pt-8">
                    <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
                      Ingredients
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {product.ingredients}
                    </p>
                    {product.hasAlcohol && (
                      <Badge variant="warning" size="sm" className="mt-3">
                        Contains Alcohol
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data View */}
      {view === 'data' && (
        <div className="container py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h2 className="text-4xl font-light mb-4">Data & Insights</h2>
              <p className="text-neutral-600">
                Comprehensive analysis based on {totalComments} user {totalComments === 1 ? 'comment' : 'comments'}
              </p>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {finishTags.length > 0 && (
                <Card>
                  <TagChart
                    title="Finish Distribution"
                    data={finishTags.map(pt => ({
                      label: pt.tag.label,
                      count: pt.count,
                      percentage: Math.round(pt.confidence * 100),
                    }))}
                  />
                </Card>
              )}

              {coverageTags.length > 0 && (
                <Card>
                  <TagChart
                    title="Coverage Distribution"
                    data={coverageTags.map(pt => ({
                      label: pt.tag.label,
                      count: pt.count,
                      percentage: Math.round(pt.confidence * 100),
                    }))}
                  />
                </Card>
              )}
            </div>

            {/* All Attributes */}
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
                All Mentioned Attributes
              </h3>
              <Card>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.tags.filter(t => t.confidence > 0.1).map((pt) => (
                    <ConfidenceBar
                      key={pt.tag.key}
                      label={pt.tag.label}
                      confidence={pt.confidence}
                      count={pt.count}
                      totalComments={totalComments}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* Data Transparency */}
            <div className="bg-neutral-50 border border-neutral-200 p-8">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
                Data Transparency
              </h3>
              <div className="grid md:grid-cols-3 gap-8 mb-6">
                <div>
                  <div className="text-3xl font-light mb-2">{totalComments}</div>
                  <div className="text-sm text-neutral-600">Total user comments</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-2">{product.tags.length}</div>
                  <div className="text-sm text-neutral-600">Unique tags extracted</div>
                </div>
                <div>
                  <div className="text-3xl font-light mb-2">
                    {new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-neutral-600">Last updated</div>
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                All insights are automatically calculated from user feedback and update in real-time as new comments are added. 
                We never manually adjust or curate data to favor any product.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
