import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.formData()
  const { grant_type } = Object.fromEntries(body)

  // Validate the request body
  if (grant_type !== 'refresh_token') return NextResponse.json({ error: 'Invalid grant_type' }, { status: 400 })

  // Simulate a database lookup for the refresh token
  const expires_in = 1000
  const access_token = 'access_token'
  const new_refresh_token = 'refresh_token'

  return NextResponse.json(
    {
      expires_in,
      access_token,
      refresh_token: new_refresh_token,
    },
    {
      status: 200,
    },
  )
}
