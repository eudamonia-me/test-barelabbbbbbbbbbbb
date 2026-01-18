// Tag extraction and aggregation logic

export interface TagDefinition {
  key: string
  category: 'skin_type' | 'finish' | 'coverage' | 'issue' | 'property' | 'longevity'
  label: string
  description?: string
  keywords: string[]
}

// Comprehensive tag dictionary
export const TAG_DICTIONARY: TagDefinition[] = [
  // Skin Type tags
  {
    key: 'skin_type_dry',
    category: 'skin_type',
    label: 'Dry Skin',
    description: 'Suitable for dry skin',
    keywords: ['dry skin', 'dryness', 'flaky', 'dehydrated', 'works for dry', 'good for dry']
  },
  {
    key: 'skin_type_oily',
    category: 'skin_type',
    label: 'Oily Skin',
    description: 'Suitable for oily skin',
    keywords: ['oily skin', 'oil control', 'sebum', 'works for oily', 'good for oily', 'controls oil']
  },
  {
    key: 'skin_type_combination',
    category: 'skin_type',
    label: 'Combination Skin',
    description: 'Suitable for combination skin',
    keywords: ['combination skin', 'combo skin', 'mixed skin', 'works for combination']
  },
  {
    key: 'skin_type_normal',
    category: 'skin_type',
    label: 'Normal Skin',
    description: 'Suitable for normal skin',
    keywords: ['normal skin', 'works for normal', 'balanced skin']
  },
  {
    key: 'skin_type_sensitive',
    category: 'skin_type',
    label: 'Sensitive Skin',
    description: 'Suitable for sensitive skin',
    keywords: ['sensitive skin', 'gentle', 'non-irritating', 'hypoallergenic', 'works for sensitive']
  },
  
  // Finish tags
  {
    key: 'finish_matte',
    category: 'finish',
    label: 'Matte Finish',
    description: 'Leaves a matte finish',
    keywords: ['matte', 'matte finish', 'no shine', 'flat finish', 'velvety']
  },
  {
    key: 'finish_dewy',
    category: 'finish',
    label: 'Dewy Finish',
    description: 'Leaves a dewy, luminous finish',
    keywords: ['dewy', 'glowy', 'luminous', 'radiant', 'glowing', 'shiny', 'wet look']
  },
  {
    key: 'finish_satin',
    category: 'finish',
    label: 'Satin Finish',
    description: 'Leaves a natural, satin finish',
    keywords: ['satin', 'satin finish', 'semi-matte', 'natural finish', 'skin-like']
  },
  {
    key: 'finish_natural',
    category: 'finish',
    label: 'Natural Finish',
    description: 'Natural, skin-like finish',
    keywords: ['natural', 'natural finish', 'looks like skin', 'second skin']
  },
  
  // Coverage tags
  {
    key: 'coverage_sheer',
    category: 'coverage',
    label: 'Sheer Coverage',
    description: 'Light, sheer coverage',
    keywords: ['sheer', 'light coverage', 'minimal coverage', 'barely there', 'natural coverage']
  },
  {
    key: 'coverage_light',
    category: 'coverage',
    label: 'Light Coverage',
    description: 'Light to medium coverage',
    keywords: ['light coverage', 'buildable', 'light to medium']
  },
  {
    key: 'coverage_medium',
    category: 'coverage',
    label: 'Medium Coverage',
    description: 'Medium coverage',
    keywords: ['medium coverage', 'good coverage', 'covers well']
  },
  {
    key: 'coverage_full',
    category: 'coverage',
    label: 'Full Coverage',
    description: 'Full, opaque coverage',
    keywords: ['full coverage', 'heavy coverage', 'high coverage', 'covers everything', 'opaque']
  },
  
  // Issue tags (problems users report)
  {
    key: 'issue_oxidation',
    category: 'issue',
    label: 'Oxidizes',
    description: 'Changes color/oxidizes over time',
    keywords: ['oxidize', 'oxidizes', 'oxidation', 'turns orange', 'changes color', 'darker throughout day']
  },
  {
    key: 'issue_no_oxidation',
    category: 'issue',
    label: 'No Oxidation',
    description: 'Does not oxidize',
    keywords: ['no oxidation', 'doesn\'t oxidize', 'color stays true', 'doesn\'t change color']
  },
  {
    key: 'issue_caking',
    category: 'issue',
    label: 'Cakes',
    description: 'Cakes or settles into lines',
    keywords: ['caking', 'cakes', 'settles into lines', 'emphasizes texture', 'creases']
  },
  {
    key: 'issue_drying',
    category: 'issue',
    label: 'Drying',
    description: 'Dries out the skin',
    keywords: ['drying', 'dries out', 'makes skin dry', 'dried me out', 'emphasizes dry patches']
  },
  {
    key: 'issue_pore_visibility',
    category: 'issue',
    label: 'Shows Pores',
    description: 'Makes pores more visible',
    keywords: ['shows pores', 'emphasizes pores', 'pores visible', 'accentuates pores']
  },
  {
    key: 'issue_no_pore_visibility',
    category: 'issue',
    label: 'Blurs Pores',
    description: 'Minimizes pore visibility',
    keywords: ['blurs pores', 'hides pores', 'pores invisible', 'smooths pores', 'pore-blurring']
  },
  {
    key: 'issue_separation',
    category: 'issue',
    label: 'Separates',
    description: 'Separates or breaks apart on skin',
    keywords: ['separates', 'breaks apart', 'patches', 'wears off unevenly']
  },
  {
    key: 'issue_breakouts',
    category: 'issue',
    label: 'Causes Breakouts',
    description: 'May cause breakouts or acne',
    keywords: ['breakouts', 'broke me out', 'acne', 'caused pimples', 'clogs pores']
  },
  {
    key: 'issue_no_breakouts',
    category: 'issue',
    label: 'Acne-Safe',
    description: 'Does not cause breakouts',
    keywords: ['no breakouts', 'acne-safe', 'non-comedogenic', 'didn\'t break me out']
  },
  
  // Property tags (positive attributes)
  {
    key: 'property_oil_control',
    category: 'property',
    label: 'Oil Control',
    description: 'Controls oil well',
    keywords: ['oil control', 'controls oil', 'keeps me matte', 'no shine', 'oil-free']
  },
  {
    key: 'property_hydrating',
    category: 'property',
    label: 'Hydrating',
    description: 'Hydrating and moisturizing',
    keywords: ['hydrating', 'moisturizing', 'doesn\'t dry', 'comfortable', 'nourishing']
  },
  {
    key: 'property_lightweight',
    category: 'property',
    label: 'Lightweight',
    description: 'Lightweight feel',
    keywords: ['lightweight', 'light feel', 'not heavy', 'breathable', 'weightless']
  },
  {
    key: 'property_blendable',
    category: 'property',
    label: 'Blendable',
    description: 'Easy to blend',
    keywords: ['blendable', 'easy to blend', 'blends well', 'smooth application']
  },
  {
    key: 'property_buildable',
    category: 'property',
    label: 'Buildable',
    description: 'Buildable coverage',
    keywords: ['buildable', 'build up', 'layerable', 'can layer']
  },
  {
    key: 'property_shade_range',
    category: 'property',
    label: 'Good Shade Range',
    description: 'Good shade selection',
    keywords: ['shade range', 'many shades', 'inclusive', 'found my shade']
  },
  {
    key: 'property_good_packaging',
    category: 'property',
    label: 'Good Packaging',
    description: 'User-friendly packaging',
    keywords: ['good packaging', 'great pump', 'nice bottle', 'easy to use', 'hygienic']
  },
  {
    key: 'property_bad_packaging',
    category: 'property',
    label: 'Poor Packaging',
    description: 'Issues with packaging',
    keywords: ['bad packaging', 'terrible pump', 'messy', 'hard to use', 'wasteful']
  },
  
  // Longevity tags
  {
    key: 'longevity_short',
    category: 'longevity',
    label: 'Short Wear',
    description: 'Wears off quickly (under 4 hours)',
    keywords: ['wears off', 'short wear', 'fades quickly', 'doesn\'t last', 'gone in hours']
  },
  {
    key: 'longevity_medium',
    category: 'longevity',
    label: 'Medium Wear',
    description: 'Lasts 4-8 hours',
    keywords: ['lasts half day', 'medium wear', 'needs touch up', 'fades by afternoon']
  },
  {
    key: 'longevity_long',
    category: 'longevity',
    label: 'Long Wear',
    description: 'Lasts 8+ hours',
    keywords: ['long lasting', 'all day', 'stays put', 'doesn\'t fade', 'lasts forever', '12 hours']
  },
]

/**
 * Extract tags from comment text based on keyword matching
 */
export function extractTagsFromText(text: string): string[] {
  const lowerText = text.toLowerCase()
  const matchedTags: string[] = []
  
  for (const tagDef of TAG_DICTIONARY) {
    for (const keyword of tagDef.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedTags.push(tagDef.key)
        break // Only add each tag once per comment
      }
    }
  }
  
  return matchedTags
}

/**
 * Calculate aggregated product tags from all comments
 */
export function aggregateProductTags(comments: Array<{ tags: string[] }>): Map<string, { count: number; confidence: number }> {
  const tagCounts = new Map<string, number>()
  const totalComments = comments.length
  
  // Count tag occurrences
  for (const comment of comments) {
    for (const tag of comment.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }
  
  // Calculate confidence scores (percentage of comments mentioning this tag)
  const aggregatedTags = new Map<string, { count: number; confidence: number }>()
  
  for (const [tag, count] of tagCounts.entries()) {
    aggregatedTags.set(tag, {
      count,
      confidence: totalComments > 0 ? count / totalComments : 0
    })
  }
  
  return aggregatedTags
}

/**
 * Get tag definition by key
 */
export function getTagDefinition(key: string): TagDefinition | undefined {
  return TAG_DICTIONARY.find(t => t.key === key)
}

/**
 * Get all tags by category
 */
export function getTagsByCategory(category: TagDefinition['category']): TagDefinition[] {
  return TAG_DICTIONARY.filter(t => t.category === category)
}

/**
 * Calculate skin type suitability scale (0 = dry, 1 = oily)
 */
export function calculateSkinTypeScale(tags: Map<string, { count: number; confidence: number }>): number {
  const dryConfidence = tags.get('skin_type_dry')?.confidence || 0
  const oilyConfidence = tags.get('skin_type_oily')?.confidence || 0
  const comboConfidence = tags.get('skin_type_combination')?.confidence || 0
  
  // Scale: 0 (dry) to 1 (oily), with combo in middle
  if (dryConfidence === 0 && oilyConfidence === 0 && comboConfidence === 0) {
    return 0.5 // neutral if no data
  }
  
  // Weighted calculation
  const total = dryConfidence + oilyConfidence + comboConfidence
  return ((oilyConfidence + (comboConfidence * 0.5)) / total)
}

/**
 * Generate neutral product summary from tags
 */
export function generateProductSummary(
  productName: string,
  tags: Map<string, { count: number; confidence: number }>,
  commentCount: number
): string {
  const parts: string[] = []
  
  // Find most mentioned attributes
  const sortedTags = Array.from(tags.entries())
    .filter(([_, data]) => data.confidence > 0.3) // Only tags mentioned by >30% of users
    .sort((a, b) => b[1].confidence - a[1].confidence)
  
  // Get finish
  const finishTag = sortedTags.find(([key]) => key.startsWith('finish_'))
  if (finishTag) {
    const tagDef = getTagDefinition(finishTag[0])
    if (tagDef) {
      parts.push(`${tagDef.label.toLowerCase()}`)
    }
  }
  
  // Get coverage
  const coverageTag = sortedTags.find(([key]) => key.startsWith('coverage_'))
  if (coverageTag) {
    const tagDef = getTagDefinition(coverageTag[0])
    if (tagDef) {
      parts.push(`${tagDef.label.toLowerCase()}`)
    }
  }
  
  const finishAndCoverage = parts.length > 0 ? `with ${parts.join(', ')}` : ''
  
  return `Based on ${commentCount} user ${commentCount === 1 ? 'comment' : 'comments'}, ${productName} is often described as having ${finishAndCoverage || 'varied characteristics'}. User experiences may vary depending on skin type and application.`
}
