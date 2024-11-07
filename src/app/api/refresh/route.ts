import { db } from '@/db'
import { FormDataValues } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { generateToken, verifyToken } from '@/utils/HandleJWT'

// POST /api/refresh
export async function POST(request: NextRequest) {
  const body = await request.formData()
  const { refresh } = Object.fromEntries(body) as FormDataValues

  // Validate the request body
  if (!refresh) return NextResponse.json({ message: 'No refresh token provided' }, { status: 400 })

  const decoded = verifyToken(refresh, 'refresh')
  if (!decoded) return NextResponse.json({ message: 'Invalid refresh token - Please login again' }, { status: 401 })

  const user = await db.user.findFirst({ where: { id: decoded.userId } })
  if (!user) return NextResponse.json({ message: 'Invalid user' }, { status: 401 })

  // Generate a new access token
  const token = generateToken(user.id!, 'access')
  return NextResponse.json({ token }, { status: 200 })
}
