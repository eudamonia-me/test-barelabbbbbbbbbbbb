'use client'

interface PropertyIndicatorProps {
  label: string
  value: 'low' | 'medium' | 'high' | 'none'
  description?: string
}

export default function PropertyIndicator({ label, value, description }: PropertyIndicatorProps) {
  const getDots = () => {
    const total = 5
    const filled = value === 'low' ? 1 : value === 'medium' ? 3 : value === 'high' ? 5 : 0
    
    return Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < filled ? 'bg-neutral-900' : 'bg-neutral-200'
        }`}
      />
    ))
  }
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <div className="text-sm text-neutral-700">{label}</div>
        {description && (
          <div className="text-xs text-neutral-500 mt-0.5">{description}</div>
        )}
      </div>
      <div className="flex gap-1">
        {getDots()}
      </div>
    </div>
  )
}
