'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'foundation',
    imageUrl: '',
    price: '',
    currency: 'USD',
    ingredients: '',
    hasSPF: false,
    spfValue: '',
    hasAlcohol: false,
    published: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to create product')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-light mb-2">Add New Product</h1>
        <p className="text-neutral-600">Create a new product entry</p>
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
            {saving ? 'Creating...' : 'Create Product'}
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
    </div>
  )
}
