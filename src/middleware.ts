import NextAuth from 'next-auth'
import authConfig from '@/lib/auth.config'
import { LOGIN, PROTECTED_SUB_ROUTES, PUBLIC_ROUTES } from './lib/routes'

const { auth: middleware } = NextAuth(authConfig)

export default middleware(async (request) => {
  const { nextUrl, auth } = request
  const isAuthenticated = !!auth?.user

  const isPublicRoute = !!PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) && !PROTECTED_SUB_ROUTES.find((route) => nextUrl.pathname.includes(route))

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN, nextUrl.origin))
  }
  if (isAuthenticated && nextUrl.pathname === LOGIN) {
    return Response.redirect(new URL('/', nextUrl.origin))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
