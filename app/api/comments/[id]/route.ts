import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { extractTagsFromText } from '@/lib/tags'

// GET /api/comments/[id] - Get single comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        product: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 }
    )
  }
}

// PATCH /api/comments/[id] - Update comment (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    
    const body = await request.json()
    
    const updateData: any = {}
    
    if (body.text !== undefined) updateData.text = body.text
    if (body.source !== undefined) updateData.source = body.source
    if (body.sourceUrl !== undefined) updateData.sourceUrl = body.sourceUrl
    if (body.skinType !== undefined) updateData.skinType = body.skinType

    const comment = await prisma.comment.update({
      where: { id },
      data: updateData,
    })

    // If text was updated, re-extract tags
    if (body.text !== undefined) {
      // Delete existing tags
      await prisma.commentTag.deleteMany({
        where: { commentId: id },
      })

      // Extract and assign new tags
      const tagKeys = extractTagsFromText(comment.text)

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

      // Re-aggregate product tags
      const comments = await prisma.comment.findMany({
        where: { productId: comment.productId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })

      // (Re-aggregation logic would go here)
    }

    return NextResponse.json(comment)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete comment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    
    const comment = await prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const productId = comment.productId

    await prisma.comment.delete({
      where: { id },
    })

    // Re-aggregate product tags after deletion
    // (Re-aggregation logic would go here)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
