import 'next-auth/jwt'
import { db } from '@/db'
import NextAuth from 'next-auth'
import { jwtDecode } from 'jwt-decode'
import authConfig from './auth.config'
import type { Adapter } from 'next-auth/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'

const API_SERVER_BASE_URL = process.env.API_SERVER_BASE_URL

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (token.access_token) {
        const decodedToken = jwtDecode(token.access_token)
        token.accessTokenExpires = decodedToken.exp! * 1000
      }

      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.access_token = user.access
        token.refresh_token = user.refresh
        return token
      }

      if (Date.now() < token.accessTokenExpires) return token

      try {
        const refreshResponse = await fetch(API_SERVER_BASE_URL + '/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: token.refresh_token }),
        })

        if (!refreshResponse.ok) {
          const error = await refreshResponse.json()
          throw new Error(error.message)
        }
        const { token: newAccessToken } = await refreshResponse.json()
        token.access_token = newAccessToken
        return token
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message, '🔥 refresh error')
        }

        return {
          ...token,
          error: 'RefreshTokenError',
        }
      }
    },

    // Handles session
    async session({ session, token }) {
      if (token.error === 'RefreshTokenError') {
        return { ...session, error: token.error }
      }

      session.user.id = token.id as string
      session.user.access = token.access_token
      session.user.refresh = token.refresh_token

      return { ...session }
    },
  },

  ...authConfig,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  adapter: PrismaAdapter(db) as Adapter,
})

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError'
  }

  interface User {
    access: string
    refresh: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: 'RefreshTokenError'
    accessTokenExpires: number
  }
}
