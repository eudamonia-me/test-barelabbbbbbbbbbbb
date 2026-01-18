'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (key: string, value: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })

      if (res.ok) {
        fetchSettings()
      } else {
        alert('Failed to update setting')
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
      alert('Failed to update setting')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-light mb-2">Site Settings</h1>
        <p className="text-neutral-600">Manage website content and configuration</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">{setting.key.replace(/_/g, ' ').toUpperCase()}</h3>
              {setting.description && (
                <p className="text-sm text-neutral-600">{setting.description}</p>
              )}
            </div>

            <SettingEditor
              settingKey={setting.key}
              value={setting.value}
              onSave={handleUpdate}
              saving={saving === setting.key}
            />
          </Card>
        ))}
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-medium mb-2">⚠️ Important</h3>
        <p className="text-sm text-neutral-700 leading-relaxed">
          Changes to site settings take effect immediately. Be careful when editing text that appears 
          on the public website, as it will be visible to all users.
        </p>
      </Card>
    </div>
  )
}

function SettingEditor({ settingKey, value, onSave, saving }: any) {
  const [editValue, setEditValue] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onSave(settingKey, editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div>
        <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 mb-3">
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{value}</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm">
          Edit
        </button>
      </div>
    )
  }

  return (
    <div>
      <textarea
        className="input mb-3"
        rows={6}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="btn-outline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
