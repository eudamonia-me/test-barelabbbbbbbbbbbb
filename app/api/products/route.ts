import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/products - List all products with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const skinType = searchParams.get('skinType')
    const finish = searchParams.get('finish')
    const coverage = searchParams.get('coverage')
    const hasSPF = searchParams.get('hasSPF')
    const hasAlcohol = searchParams.get('hasAlcohol')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      published: true,
    }

    if (category) {
      where.category = category
    }

    if (brand) {
      where.brand = brand
    }

    if (hasSPF === 'true') {
      where.hasSPF = true
    }

    if (hasAlcohol === 'false') {
      where.hasAlcohol = false
    }

    // Tag-based filtering
    const tagFilters: string[] = []
    
    if (skinType) {
      tagFilters.push(`skin_type_${skinType}`)
    }
    
    if (finish) {
      tagFilters.push(`finish_${finish}`)
    }
    
    if (coverage) {
      tagFilters.push(`coverage_${coverage}`)
    }

    // If tag filters exist, we need to filter products that have these tags
    if (tagFilters.length > 0) {
      where.tags = {
        some: {
          tag: {
            key: {
              in: tagFilters,
            },
          },
          confidence: {
            gte: 0.3, // At least 30% of users mention this
          },
        },
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
            where: {
              confidence: {
                gte: 0.2, // Include tags mentioned by at least 20% of users
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        brand: body.brand,
        category: body.category,
        imageUrl: body.imageUrl,
        price: body.price ? parseFloat(body.price) : null,
        currency: body.currency || 'USD',
        ingredients: body.ingredients,
        hasSPF: body.hasSPF || false,
        spfValue: body.spfValue ? parseInt(body.spfValue) : null,
        hasAlcohol: body.hasAlcohol || false,
        published: body.published !== false,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
