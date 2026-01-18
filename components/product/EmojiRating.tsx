interface EmojiRatingProps {
  score: number // 0 to 1
  category: string
}

export default function EmojiRating({ score, category }: EmojiRatingProps) {
  // Determine emoji based on score
  const getEmoji = () => {
    if (score >= 0.8) return '😍'
    if (score >= 0.6) return '😊'
    if (score >= 0.4) return '😐'
    if (score >= 0.2) return '😕'
    return '😞'
  }
  
  const getLabel = () => {
    if (score >= 0.8) return 'Excellent'
    if (score >= 0.6) return 'Good'
    if (score >= 0.4) return 'Mixed'
    if (score >= 0.2) return 'Poor'
    return 'Very Poor'
  }
  
  const getColor = () => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-green-500'
    if (score >= 0.4) return 'text-yellow-600'
    if (score >= 0.2) return 'text-orange-600'
    return 'text-red-600'
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className="text-4xl">{getEmoji()}</div>
      <div>
        <div className={`text-sm font-medium ${getColor()}`}>{getLabel()}</div>
        <div className="text-xs text-neutral-500">{category}</div>
      </div>
    </div>
  )
}
