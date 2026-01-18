import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: {
      tags: {
        include: { tag: true },
        where: { confidence: { gte: 0.3 } },
        orderBy: { confidence: 'desc' },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { viewCount: 'desc' },
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-light mb-4">All Products</h1>
        <p className="text-neutral-600">
          {products.length} products with real user feedback
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-500">No products available yet</p>
        </div>
      )}
    </div>
  )
}
