'use client'

interface ClickableTagProps {
  label: string
  count: number
  percentage: number
  positive?: boolean
  onClick?: () => void
}

export default function ClickableTag({ 
  label, 
  count, 
  percentage, 
  positive,
  onClick 
}: ClickableTagProps) {
  const bgColor = positive === true 
    ? 'bg-green-50 hover:bg-green-100 border-green-200' 
    : positive === false 
    ? 'bg-red-50 hover:bg-red-100 border-red-200'
    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
  
  const textColor = positive === true 
    ? 'text-green-900' 
    : positive === false 
    ? 'text-red-900'
    : 'text-neutral-900'
  
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-2 border rounded-full
        transition-colors cursor-pointer text-sm
        ${bgColor} ${textColor}
      `}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-70">{percentage}%</span>
    </button>
  )
}
