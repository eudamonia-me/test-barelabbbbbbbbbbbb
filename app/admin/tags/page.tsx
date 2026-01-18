'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags')
      const data = await res.json()
      setTags(data)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = filter === 'all' 
    ? tags 
    : tags.filter(t => t.category === filter)

  const categories = [
    { value: 'all', label: 'All Tags' },
    { value: 'skin_type', label: 'Skin Type' },
    { value: 'finish', label: 'Finish' },
    { value: 'coverage', label: 'Coverage' },
    { value: 'issue', label: 'Issues' },
    { value: 'property', label: 'Properties' },
    { value: 'longevity', label: 'Longevity' },
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light mb-2">Tag Dictionary</h1>
        <p className="text-neutral-600">
          {tags.length} tags used for extracting insights from user comments
        </p>
      </div>

      <Card>
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-sm text-sm transition-colors ${
                filter === cat.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-start justify-between p-4 border border-neutral-200 rounded-sm hover:bg-neutral-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-neutral-900">{tag.label}</span>
                  <Badge size="sm">{tag.category}</Badge>
                </div>
                <div className="text-sm text-neutral-600 mb-2">
                  Key: <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs">{tag.key}</code>
                </div>
                {tag.description && (
                  <p className="text-sm text-neutral-600">{tag.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No tags in this category</p>
          </div>
        )}
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <h3 className="text-lg font-medium mb-2">About Tags</h3>
        <p className="text-sm text-neutral-700 leading-relaxed mb-4">
          Tags are automatically extracted from user comments using keyword matching. When a user mentions 
          certain words or phrases, the system assigns relevant tags to their comment. These tags are then 
          aggregated across all comments for a product to generate probability-based insights.
        </p>
        <p className="text-sm text-neutral-700 leading-relaxed">
          The tag dictionary is pre-populated with common cosmetic attributes. In future versions, 
          you'll be able to add custom tags directly from the admin panel.
        </p>
      </Card>
    </div>
  )
}
