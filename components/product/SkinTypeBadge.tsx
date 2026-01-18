interface SkinTypeBadgeProps {
  type: string
  size?: 'sm' | 'md'
}

export default function SkinTypeBadge({ type, size = 'sm' }: SkinTypeBadgeProps) {
  const icons: { [key: string]: string } = {
    dry: '🏜️',
    oily: '💧',
    combination: '🔄',
    normal: '✨',
    sensitive: '🌸',
    'acne-prone': '🔴',
    dehydrated: '💦',
    mature: '⏳',
  }
  
  const labels: { [key: string]: string } = {
    dry: 'Dry',
    oily: 'Oily',
    combination: 'Combo',
    normal: 'Normal',
    sensitive: 'Sensitive',
    'acne-prone': 'Acne-Prone',
    dehydrated: 'Dehydrated',
    mature: 'Mature',
  }
  
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
  
  return (
    <div className={`inline-flex items-center gap-1.5 bg-neutral-100 rounded-full ${sizeClasses}`}>
      <span>{icons[type] || '👤'}</span>
      <span className="font-medium text-neutral-700">{labels[type] || type}</span>
    </div>
  )
}
