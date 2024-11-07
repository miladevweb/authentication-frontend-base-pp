import 'next-auth/jwt'
import NextAuth from 'next-auth'
import { jwtDecode } from 'jwt-decode'
import { FormDataValues } from '@/types'
import CredentialsProvider from 'next-auth/providers/credentials'

const API_SERVER_BASE_URL = process.env.API_SERVER_BASE_URL

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john.doe@example.com' },
        password: { label: 'Password', type: 'password', placeholder: 'Your password' },
      },

      async authorize(credentials) {
        if (credentials === null) return null
        const credentialsCopy = credentials as FormDataValues

        const tokenResponse = await fetch(API_SERVER_BASE_URL + '/login', {
          method: 'POST',
          body: new URLSearchParams(credentialsCopy),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        if (!tokenResponse.ok) return null

        // Get User Info
        const { access, refresh } = await tokenResponse.json()

        const userResponse = await fetch(API_SERVER_BASE_URL + '/user', {
          headers: { Authorization: 'Bearer ' + access },
        })

        if (!userResponse.ok) return null
        const user = await userResponse.json()
        return {
          ...user,
          access,
          refresh,
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },
  // pages: { signIn: '/signin' },

  callbacks: {
    async jwt({ token, user }) {
      if (token.access_token) {
        const decodedToken = jwtDecode(token.access_token)
        token.accessTokenExpires = decodedToken.exp! * 1000

        if (Date.now() < token.accessTokenExpires) return token
        else {
          const refreshResponse = await fetch(API_SERVER_BASE_URL + '/refresh', {
            method: 'POST',
            body: new URLSearchParams({ refresh: token.refresh_token }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })

          if (!refreshResponse.ok) await signOut()
          const { token: newAccessToken } = await refreshResponse.json()
          token.access_token = newAccessToken
        }
      }

      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.access_token = user.access
        token.refresh_token = user.refresh
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.access = token.access_token
      session.user.refresh = token.refresh_token

      return { ...session }
    },
  },
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
