'use client'

interface SkinTypeScaleProps {
  value: number // 0 (dry) to 1 (oily)
  dryCount?: number
  oilyCount?: number
  comboCount?: number
  totalComments: number
}

export default function SkinTypeScale({ 
  value, 
  dryCount = 0, 
  oilyCount = 0, 
  comboCount = 0,
  totalComments 
}: SkinTypeScaleProps) {
  const position = value * 100
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-neutral-900">Skin Type Suitability</h4>
      <div className="relative">
        {/* Scale bar */}
        <div className="h-8 bg-gradient-to-r from-blue-100 via-purple-100 to-orange-100 rounded-sm relative">
          {/* Indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-10 bg-neutral-900 transition-all duration-500"
            style={{ left: `${position}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-neutral-900 whitespace-nowrap">
              Based on user data
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-600">
          <span>Dry Skin</span>
          <span>Combination</span>
          <span>Oily Skin</span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 text-xs text-neutral-600 mt-4">
        {dryCount > 0 && (
          <div>
            <span className="font-medium">{dryCount}</span> dry skin users
          </div>
        )}
        {comboCount > 0 && (
          <div>
            <span className="font-medium">{comboCount}</span> combination skin users
          </div>
        )}
        {oilyCount > 0 && (
          <div>
            <span className="font-medium">{oilyCount}</span> oily skin users
          </div>
        )}
      </div>
      
      <p className="text-xs text-neutral-500 italic">
        Most users with {value < 0.33 ? 'dry' : value > 0.66 ? 'oily' : 'combination'} skin report positive experiences
      </p>
    </div>
  )
}
