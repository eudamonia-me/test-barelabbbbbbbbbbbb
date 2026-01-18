import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Products</h1>
          <p className="text-neutral-600">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Brand
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Comments
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4">
                    <Badge size="sm">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {product._count.comments}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      size="sm"
                      variant={product.published ? 'success' : 'warning'}
                    >
                      {product.published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="text-sm text-neutral-600 hover:text-neutral-900"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No products yet</p>
            <Link href="/admin/products/new" className="btn-primary">
              Add your first product
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
