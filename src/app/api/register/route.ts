import { db } from '@/db'
import { FormDataValues } from '@/types'
import { encryptPassword } from '@/utils/HandleBcrypt'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/register
export async function POST(request: NextRequest) {
  const body = await request.formData()
  const { name, email, password } = Object.fromEntries(body) as FormDataValues

  const user = await db.user.findFirst({ where: { email } })

  if (user) return NextResponse.json({ message: 'User already exists' }, { status: 400 })

  // Hash the password
  const passwordHash = await encryptPassword(password)

  // Create a new user
  await db.user.create({
    data: { name, email, password: passwordHash },
  })

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
}
