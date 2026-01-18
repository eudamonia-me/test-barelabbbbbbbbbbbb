'use client'

interface ConfidenceBarProps {
  label: string
  confidence: number // 0 to 1
  count: number
  totalComments: number
}

export default function ConfidenceBar({ label, confidence, count, totalComments }: ConfidenceBarProps) {
  const percentage = Math.round(confidence * 100)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-700">{label}</span>
        <span className="text-neutral-500 text-xs">
          {count} of {totalComments} users
        </span>
      </div>
      <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-neutral-800 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-neutral-600">
        {percentage}% mention this
      </div>
    </div>
  )
}
