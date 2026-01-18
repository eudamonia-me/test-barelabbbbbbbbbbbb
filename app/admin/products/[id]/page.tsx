'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'foundation',
    description: '',
    imageUrl: '',
    price: '',
    currency: 'USD',
    ingredients: '',
    hasSPF: false,
    spfValue: '',
    hasAlcohol: false,
    published: true,
  })

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
      setFormData({
        name: data.name || '',
        brand: data.brand || '',
        category: data.category || 'foundation',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        price: data.price?.toString() || '',
        currency: data.currency || 'USD',
        ingredients: data.ingredients || '',
        hasSPF: data.hasSPF || false,
        spfValue: data.spfValue?.toString() || '',
        hasAlcohol: data.hasAlcohol || false,
        published: data.published !== false,
      })
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Edit Product</h1>
          <p className="text-neutral-600">{product?.name}</p>
        </div>
        <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700">
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-light mb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name *</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Brand *</label>
              <input
                type="text"
                className="input"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="foundation">Foundation</option>
                <option value="concealer">Concealer</option>
                <option value="powder">Powder</option>
                <option value="primer">Primer</option>
                <option value="blush">Blush</option>
                <option value="bronzer">Bronzer</option>
              </select>
            </div>

            <div>
              <label className="label">Image URL</label>
              <input
                type="url"
                className="input"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label">Price</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Currency</label>
              <select
                className="input"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Description (auto-generated from tags)</label>
            <textarea
              className="input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Leave empty to auto-generate from user feedback"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-light mb-4">Formula Details</h2>
          
          <div>
            <label className="label">Ingredients</label>
            <textarea
              className="input"
              rows={4}
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Comma-separated ingredient list"
            />
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasSPF}
                onChange={(e) => setFormData({ ...formData, hasSPF: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Has SPF</span>
            </label>

            {formData.hasSPF && (
              <div className="ml-6">
                <label className="label">SPF Value</label>
                <input
                  type="number"
                  className="input w-32"
                  value={formData.spfValue}
                  onChange={(e) => setFormData({ ...formData, spfValue: e.target.value })}
                  placeholder="e.g., 15"
                />
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasAlcohol}
                onChange={(e) => setFormData({ ...formData, hasAlcohol: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Contains Alcohol</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Published (visible on website)</span>
            </label>
          </div>
        </Card>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>

      <Card>
        <h2 className="text-xl font-light mb-4">Product Stats</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-neutral-600">Comments</div>
            <div className="text-2xl font-light">{product?.comments?.length || 0}</div>
          </div>
          <div>
            <div className="text-neutral-600">Tags</div>
            <div className="text-2xl font-light">{product?.tags?.length || 0}</div>
          </div>
          <div>
            <div className="text-neutral-600">Views</div>
            <div className="text-2xl font-light">{product?.viewCount || 0}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
