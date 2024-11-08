import NextAuth from 'next-auth'
import authConfig from '@/lib/auth.config'
import { LOGIN, PROTECTED_SUB_ROUTES, PUBLIC_ROUTES } from './lib/routes'

const { auth } = NextAuth(authConfig)

export default auth(async (request) => {
  const { nextUrl, auth: authRequest } = request

  const isAuthenticated = !!authRequest?.user

  const isPublicRoute =
    !!(PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === '/about') && !PROTECTED_SUB_ROUTES.find((route) => nextUrl.pathname.includes(route))

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(LOGIN, nextUrl.origin))
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
