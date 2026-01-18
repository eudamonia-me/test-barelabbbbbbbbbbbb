import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { generateProductSummary } from '@/lib/tags'

// GET /api/products/[id] - Get single product with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
          orderBy: {
            confidence: 'desc',
          },
        },
        comments: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Generate summary if not exists
    if (!product.description && product.comments.length > 0) {
      const tagsMap = new Map(
        product.tags.map((pt) => [pt.tag.key, { count: pt.count, confidence: pt.confidence }])
      )
      const summary = generateProductSummary(product.name, tagsMap, product.comments.length)
      
      // Update product with generated summary
      await prisma.product.update({
        where: { id },
        data: { description: summary },
      })
      
      product.description = summary
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Update product (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    
    const body = await request.json()
    
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.category !== undefined) updateData.category = body.category
    if (body.description !== undefined) updateData.description = body.description
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.price !== undefined) updateData.price = body.price ? parseFloat(body.price) : null
    if (body.currency !== undefined) updateData.currency = body.currency
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients
    if (body.hasSPF !== undefined) updateData.hasSPF = body.hasSPF
    if (body.spfValue !== undefined) updateData.spfValue = body.spfValue ? parseInt(body.spfValue) : null
    if (body.hasAlcohol !== undefined) updateData.hasAlcohol = body.hasAlcohol
    if (body.published !== undefined) updateData.published = body.published

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
