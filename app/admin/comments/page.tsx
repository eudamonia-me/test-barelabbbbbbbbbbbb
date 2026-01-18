'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments')
      const data = await res.json()
      setComments(data.comments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Comments</h1>
          <p className="text-neutral-600">{comments.length} total comments</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="btn-primary">
          + Add Comment
        </button>
      </div>

      {showAddForm && (
        <AddCommentForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            fetchComments()
          }}
        />
      )}

      <Card padding="none">
        <div className="divide-y divide-neutral-200">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-neutral-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-neutral-900">
                      {comment.product.brand} - {comment.product.name}
                    </span>
                    {comment.skinType && (
                      <Badge size="sm">{comment.skinType} skin</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">{comment.text}</p>
                  <div className="flex flex-wrap gap-1">
                    {comment.tags?.slice(0, 5).map((ct: any) => (
                      <Badge key={ct.tag.key} size="sm">
                        {ct.tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-sm text-red-600 hover:text-red-700 ml-4"
                >
                  Delete
                </button>
              </div>
              <div className="text-xs text-neutral-500">
                Source: {comment.source} • {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No comments yet</p>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              Add your first comment
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

function AddCommentForm({ onClose, onSuccess }: any) {
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    productId: '',
    text: '',
    skinType: '',
    source: 'manual',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data.products)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onSuccess()
      } else {
        alert('Failed to add comment')
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-light mb-4">Add New Comment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Product *</label>
          <select
            className="input"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
          >
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Comment Text *</label>
          <textarea
            className="input"
            rows={4}
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            placeholder="Enter user feedback..."
          />
        </div>

        <div>
          <label className="label">Skin Type (optional)</label>
          <select
            className="input"
            value={formData.skinType}
            onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
          >
            <option value="">Not specified</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
            <option value="normal">Normal</option>
            <option value="sensitive">Sensitive</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Adding...' : 'Add Comment'}
          </button>
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </Card>
  )
}
