import { db } from '@/db'
import { ErrorReason } from '@/types'
import { verifyToken } from '@/utils/HandleJWT'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/user
export async function GET(request: NextRequest) {
  const bearerToken = request.headers.get('Authorization') ?? ''
  const token = bearerToken.split(' ')[1]

  if (!token) return NextResponse.json({ message: ErrorReason.NO_TOKEN }, { status: 401 })

  // Verify the token
  const decoded = verifyToken(token, 'access')
  if (!decoded) return NextResponse.json({ message: ErrorReason.INVALID_TOKEN }, { status: 401 })

  // Find the user
  const user = await db.user.findFirst({ where: { id: decoded.userId } })

  if (!user) return NextResponse.json({ message: ErrorReason.USER_NOT_FOUND }, { status: 401 })
  return NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
    { status: 200 },
  )
}
