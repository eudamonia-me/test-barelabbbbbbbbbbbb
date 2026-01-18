import Link from 'next/link'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: {
    id: string
    name: string
    brand: string
    category: string
    imageUrl?: string | null
    tags?: Array<{
      tag: {
        key: string
        label: string
        category: string
      }
      confidence: number
    }>
    _count?: {
      comments: number
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const topTags = product.tags
    ?.filter(t => t.confidence > 0.3)
    .slice(0, 3)
    .map(t => t.tag) || []
  
  return (
    <Link href={`/products/${product.id}`}>
      <div className="card hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              {product.brand}
            </div>
            <h3 className="text-lg font-normal text-neutral-900 mt-1">
              {product.name}
            </h3>
          </div>
          
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topTags.map((tag) => (
                <Badge key={tag.key} size="sm">
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
          
          {product._count && (
            <div className="text-xs text-neutral-500">
              Based on {product._count.comments} user {product._count.comments === 1 ? 'comment' : 'comments'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
