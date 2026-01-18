import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/settings - Get all site settings (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const settings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc',
      },
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/settings - Update site settings (admin only)
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    
    if (!body.key || body.value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key: body.key },
      update: { value: body.value },
      create: {
        key: body.key,
        value: body.value,
        description: body.description,
      },
    })

    return NextResponse.json(setting)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}
