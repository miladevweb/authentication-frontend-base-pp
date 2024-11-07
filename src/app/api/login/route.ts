import { db } from '@/db'
import { FormDataValues } from '@/types'
import { generateToken } from '@/utils/HandleJWT'
import { comparePassword } from '@/utils/HandleBcrypt'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/login
export async function POST(request: NextRequest) {
  const body = await request.formData()
  const { email, password } = Object.fromEntries(body) as FormDataValues

  // Find the user
  const user = await db.user.findFirst({ where: { email } })
  if (!user) return NextResponse.json({ message: 'This email is not registered' }, { status: 401 })

  // Compare the password
  const isValid = await comparePassword(password, user.password!)
  if (!isValid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })

  // Generate access and refresh tokens
  const userId = user.id!
  const access = generateToken(userId, 'access')
  const refresh = generateToken(userId, 'refresh')
  return NextResponse.json({ access, refresh }, { status: 200 })
}
