import Badge from '@/components/ui/Badge'
import { format } from 'date-fns'

interface CommentCardProps {
  comment: {
    id: string
    text: string
    skinType?: string | null
    source: string
    createdAt: Date | string
    tags?: Array<{
      tag: {
        key: string
        label: string
      }
    }>
  }
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="border-b border-neutral-200 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center">
          <svg 
            className="w-4 h-4 text-neutral-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {comment.skinType && (
              <Badge size="sm" variant="default">
                {comment.skinType} skin
              </Badge>
            )}
            <span className="text-xs text-neutral-400">
              {typeof comment.createdAt === 'string' 
                ? format(new Date(comment.createdAt), 'MMM d, yyyy')
                : format(comment.createdAt, 'MMM d, yyyy')
              }
            </span>
          </div>
          
          <p className="text-sm text-neutral-700 leading-relaxed mb-3">
            {comment.text}
          </p>
          
          {comment.tags && comment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {comment.tags.slice(0, 5).map((ct) => (
                <Badge key={ct.tag.key} size="sm">
                  {ct.tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
