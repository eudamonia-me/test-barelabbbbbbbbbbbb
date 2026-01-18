'use client'

interface PerceptionSliderProps {
  label: string
  value: number // 0 to 1
  leftLabel: string
  rightLabel: string
  userCount: number
}

export default function PerceptionSlider({ 
  label, 
  value, 
  leftLabel, 
  rightLabel,
  userCount 
}: PerceptionSliderProps) {
  const percentage = Math.round(value * 100)
  
  return (
    <div className="py-4 border-b border-neutral-200 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        <span className="text-xs text-neutral-500">{userCount} users</span>
      </div>
      
      {/* Slider track */}
      <div className="relative h-2 bg-neutral-100 rounded-full mb-2">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 bg-neutral-800 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-900 rounded-full border-2 border-white shadow-md transition-all duration-500"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
