import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { extractTagsFromText, aggregateProductTags } from '@/lib/tags'

// GET /api/comments - List comments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (productId) {
      where.productId = productId
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              brand: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create a new comment (admin only for now)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    if (!body.productId || !body.text) {
      return NextResponse.json(
        { error: 'Product ID and text are required' },
        { status: 400 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        productId: body.productId,
        text: body.text,
        source: body.source || 'manual',
        sourceUrl: body.sourceUrl,
        skinType: body.skinType,
      },
    })

    // Extract tags from comment text
    const tagKeys = extractTagsFromText(comment.text)

    // Assign tags to comment
    for (const tagKey of tagKeys) {
      const tag = await prisma.tag.findUnique({
        where: { key: tagKey },
      })

      if (tag) {
        await prisma.commentTag.create({
          data: {
            commentId: comment.id,
            tagId: tag.id,
          },
        })
      }
    }

    // Mark comment as processed
    await prisma.comment.update({
      where: { id: comment.id },
      data: { processed: true },
    })

    // Re-aggregate product tags
    await aggregateProductTagsForProduct(body.productId)

    // Return comment with tags
    const commentWithTags = await prisma.comment.findUnique({
      where: { id: comment.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(commentWithTags, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// Helper function to re-aggregate product tags
async function aggregateProductTagsForProduct(productId: string) {
  const comments = await prisma.comment.findMany({
    where: { productId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  const commentsWithTags = comments.map(c => ({
    tags: c.tags.map(t => t.tag.key),
  }))

  const aggregatedTags = aggregateProductTags(commentsWithTags)

  // Delete existing product tags
  await prisma.productTag.deleteMany({
    where: { productId },
  })

  // Create new aggregated product tags
  for (const [tagKey, data] of aggregatedTags.entries()) {
    const tag = await prisma.tag.findUnique({
      where: { key: tagKey },
    })

    if (tag) {
      await prisma.productTag.create({
        data: {
          productId,
          tagId: tag.id,
          count: data.count,
          confidence: data.confidence,
        },
      })
    }
  }
}
