import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const where: any = {}
    
    if (category) {
      where.category = category
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: {
        category: 'asc',
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST /api/tags - Create a new tag (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    if (!body.key || !body.category || !body.label) {
      return NextResponse.json(
        { error: 'Key, category, and label are required' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        key: body.key,
        category: body.category,
        label: body.label,
        description: body.description,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
