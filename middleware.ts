import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  console.log(isLoggedIn, 'isLoggedIn')

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  console.log(isApiAuthRoute, 'isApiAuthRoute')

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/about', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
