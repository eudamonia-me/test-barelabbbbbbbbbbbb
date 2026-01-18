import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { incrementProductViewCount } from '@/lib/analytics'
import { calculateSkinTypeScale } from '@/lib/tags'
import EmojiRating from '@/components/product/EmojiRating'
import PerceptionSlider from '@/components/product/PerceptionSlider'
import ClickableTag from '@/components/product/ClickableTag'
import SkinTypeBadge from '@/components/product/SkinTypeBadge'
import CommentCard from '@/components/product/CommentCard'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function ProductPageNew(props: Props) {
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

  incrementProductViewCount(product.id)

  const tab = searchParams.tab || 'overview'
  const totalComments = product.comments.length

  // Calculate overall scores
  const tagsMap = new Map(
    product.tags.map((pt) => [pt.tag.key, { count: pt.count, confidence: pt.confidence }])
  )

  // Calculate perception sliders
  const getSliderValue = (positiveKey: string, negativeKey: string) => {
    const positive = tagsMap.get(positiveKey)?.confidence || 0
    const negative = tagsMap.get(negativeKey)?.confidence || 0
    if (positive + negative === 0) return 0.5
    return positive / (positive + negative)
  }

  const sliders = [
    {
      label: 'Longevity',
      value: getSliderValue('longevity_long', 'longevity_short'),
      leftLabel: 'Short wear',
      rightLabel: 'Long lasting',
      userCount: Math.round((tagsMap.get('longevity_long')?.count || 0) + (tagsMap.get('longevity_short')?.count || 0))
    },
    {
      label: 'Coverage',
      value: (tagsMap.get('coverage_full')?.confidence || 0.3),
      leftLabel: 'Sheer',
      rightLabel: 'Full coverage',
      userCount: product.tags.filter(t => t.tag.category === 'coverage').reduce((sum, t) => sum + t.count, 0)
    },
    {
      label: 'Finish',
      value: getSliderValue('finish_matte', 'finish_dewy'),
      leftLabel: 'Dewy',
      rightLabel: 'Matte',
      userCount: product.tags.filter(t => t.tag.category === 'finish').reduce((sum, t) => sum + t.count, 0)
    },
    {
      label: 'Oil Control',
      value: tagsMap.get('property_oil_control')?.confidence || 0.5,
      leftLabel: 'Low',
      rightLabel: 'High',
      userCount: tagsMap.get('property_oil_control')?.count || 0
    },
    {
      label: 'Hydration',
      value: tagsMap.get('property_hydrating')?.confidence || 0.5,
      leftLabel: 'Drying',
      rightLabel: 'Hydrating',
      userCount: tagsMap.get('property_hydrating')?.count || 0
    },
    {
      label: 'Comfort',
      value: tagsMap.get('property_lightweight')?.confidence || 0.6,
      leftLabel: 'Heavy',
      rightLabel: 'Lightweight',
      userCount: tagsMap.get('property_lightweight')?.count || 0
    },
  ]

  // Overall performance score (average of positive tags)
  const positiveConfidence = product.tags
    .filter(t => !t.tag.key.includes('issue_') || t.tag.key.includes('no_'))
    .reduce((sum, t) => sum + t.confidence, 0) / Math.max(product.tags.length, 1)

  // Top 5 facts
  const topFacts = []
  const finishTag = product.tags.find(t => t.tag.category === 'finish' && t.confidence > 0.3)
  const coverageTag = product.tags.find(t => t.tag.category === 'coverage' && t.confidence > 0.3)
  const skinTypeTag = product.tags.find(t => t.tag.category === 'skin_type' && t.confidence > 0.4)
  const longevityTag = product.tags.find(t => t.tag.category === 'longevity' && t.confidence > 0.3)
  const issueTag = product.tags.find(t => t.tag.key.includes('no_oxidation') && t.confidence > 0.3)

  if (finishTag) topFacts.push(`${Math.round(finishTag.confidence * 100)}% of users describe it as ${finishTag.tag.label.toLowerCase()}`)
  if (coverageTag) topFacts.push(`Most commonly rated as ${coverageTag.tag.label.toLowerCase()}`)
  if (skinTypeTag) topFacts.push(`Works well for ${skinTypeTag.tag.label.toLowerCase()}`)
  if (longevityTag) topFacts.push(`${longevityTag.tag.label} according to user feedback`)
  if (issueTag) topFacts.push(`${Math.round(issueTag.confidence * 100)}% report no oxidation issues`)

  // Fill remaining facts
  for (let i = topFacts.length; i < Math.min(5, product.tags.length); i++) {
    const nextTag = product.tags[i]
    if (nextTag && nextTag.confidence > 0.25) {
      topFacts.push(`${Math.round(nextTag.confidence * 100)}% mention: ${nextTag.tag.label.toLowerCase()}`)
    }
  }

  return (
    <div>
      {/* Product Header Section */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image */}
            <div>
              <div className="aspect-square bg-neutral-100 overflow-hidden rounded-lg">
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
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Brand & Name */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  {product.brand}
                </div>
                <h1 className="text-4xl font-light mb-4">{product.name}</h1>
                {product.price && (
                  <div className="text-2xl font-light text-neutral-700">
                    {product.currency} {product.price.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Overall Ratings - Emoji Style */}
              <div className="mb-8 pb-8 border-b border-neutral-200">
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Overall Performance
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EmojiRating score={positiveConfidence} category="Overall" />
                  <EmojiRating 
                    score={tagsMap.get('property_oil_control')?.confidence || 0.5} 
                    category="Oil Control" 
                  />
                  <EmojiRating 
                    score={getSliderValue('longevity_long', 'longevity_short')} 
                    category="Longevity" 
                  />
                  <EmojiRating 
                    score={tagsMap.get('issue_no_oxidation')?.confidence || 0.5} 
                    category="No Oxidation" 
                  />
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Based on {totalComments} user {totalComments === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Top 5 Facts */}
              <div className="mb-8">
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
                  Top 5 Facts from User Feedback
                </div>
                <ul className="space-y-2.5">
                  {topFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-neutral-400 flex-shrink-0">•</span>
                      <span className="text-sm text-neutral-700 leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1 bg-neutral-100 text-xs rounded-full">
                  {product.category}
                </span>
                {product.hasSPF && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    SPF {product.spfValue}
                  </span>
                )}
                {!product.hasAlcohol && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Alcohol-free
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="container">
          <div className="flex gap-8">
            <Link
              href={`/products/${product.id}?tab=overview`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'overview'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Performance
            </Link>
            <Link
              href={`/products/${product.id}?tab=ingredients`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'ingredients'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Ingredients
            </Link>
            <Link
              href={`/products/${product.id}?tab=reviews`}
              className={`pb-4 text-sm uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'reviews'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Reviews ({totalComments})
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container py-12">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Perception Sliders */}
            <div>
              <h2 className="text-2xl font-light mb-6">User Perception</h2>
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                {sliders.filter(s => s.userCount > 0).map((slider, idx) => (
                  <PerceptionSlider key={idx} {...slider} />
                ))}
              </div>
            </div>

            {/* Dense Tag Section */}
            <div>
              <h2 className="text-2xl font-light mb-6">
                Common Feedback Tags
                <span className="text-sm font-normal text-neutral-500 ml-3">
                  Click to find similar products
                </span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags
                  .filter(t => t.confidence > 0.15)
                  .map((pt) => {
                    const isPositive = pt.tag.category === 'property' || pt.tag.key.includes('no_')
                    const isNegative = pt.tag.category === 'issue' && !pt.tag.key.includes('no_')
                    
                    return (
                      <ClickableTag
                        key={pt.tag.key}
                        label={pt.tag.label}
                        count={pt.count}
                        percentage={Math.round(pt.confidence * 100)}
                        positive={isPositive ? true : isNegative ? false : undefined}
                        onClick={() => {
                          // Navigate to filtered products
                          window.location.href = `/products?tag=${pt.tag.key}`
                        }}
                      />
                    )
                  })}
              </div>
            </div>
          </div>
        )}

        {/* INGREDIENTS TAB */}
        {tab === 'ingredients' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-6">Ingredient Analysis</h2>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-8">
              {product.ingredients ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 uppercase tracking-wider text-neutral-500">
                      Full Ingredient List
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Formula Highlights</h4>
                      <ul className="space-y-2 text-sm text-neutral-600">
                        {product.hasSPF && <li>✓ Contains SPF {product.spfValue} protection</li>}
                        {!product.hasAlcohol && <li>✓ Alcohol-free formula</li>}
                        <li>• Synthetic and natural ingredients</li>
                        <li>• Check for personal sensitivities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-3">User Reports</h4>
                      <ul className="space-y-2 text-sm text-neutral-600">
                        {(tagsMap.get('issue_no_breakouts')?.confidence ?? 0) > 0.3 && (
                          <li>✓ {Math.round((tagsMap.get('issue_no_breakouts')?.confidence || 0) * 100)}% report no breakouts</li>
                        )}
                        {(tagsMap.get('skin_type_sensitive')?.confidence ?? 0) > 0.3 && (
                          <li>✓ Used by sensitive skin types</li>
                        )}
                        <li>• Individual results may vary</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-neutral-600">
                    <strong>Disclaimer:</strong> This is not medical advice. Ingredient analysis is based on general information and user feedback. 
                    Consult a dermatologist for specific skin concerns.
                  </div>
                </>
              ) : (
                <p className="text-neutral-500 text-center py-8">Ingredient information not available</p>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light">User Reviews</h2>
              <div className="text-sm text-neutral-500">
                {totalComments} {totalComments === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-6 mb-12">
              {product.comments.length > 0 ? (
                product.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-neutral-200 rounded-lg p-6 relative">
                    {/* Skin Type Badge in top right */}
                    {comment.skinType && (
                      <div className="absolute top-4 right-4">
                        <SkinTypeBadge type={comment.skinType} />
                      </div>
                    )}
                    
                    <div className="pr-32">
                      <p className="text-neutral-700 leading-relaxed mb-4">{comment.text}</p>
                      
                      {comment.tags && comment.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {comment.tags.slice(0, 6).map((ct) => (
                            <span key={ct.tag.key} className="px-2 py-1 bg-neutral-100 text-xs rounded-full text-neutral-600">
                              {ct.tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  No reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>

            {/* Smart Product Discovery */}
            <div className="border-t border-neutral-200 pt-12">
              <h3 className="text-xl font-light mb-6">Discover Similar Products</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href={`/products?category=${product.category}`}
                  className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">Same Category</div>
                  <div className="text-xs text-neutral-500">Other {product.category} products</div>
                </Link>
                <Link
                  href={`/products?brand=${product.brand}`}
                  className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">Same Brand</div>
                  <div className="text-xs text-neutral-500">More from {product.brand}</div>
                </Link>
                <Link
                  href={`/products?finish=${product.tags.find(t => t.tag.category === 'finish')?.tag.key.replace('finish_', '')}`}
                  className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">Similar Finish</div>
                  <div className="text-xs text-neutral-500">Same finish type</div>
                </Link>
                <Link
                  href={`/products?skinType=${product.comments[0]?.skinType || 'all'}`}
                  className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">For Your Skin</div>
                  <div className="text-xs text-neutral-500">Matches your type</div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
