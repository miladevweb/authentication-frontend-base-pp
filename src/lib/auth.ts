import 'next-auth/jwt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null

        const response = await fetch(process.env.API_SERVER_BASE_URL! + '/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },

          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: 'refresh_token',
          }),
        })

        if (!response.ok) {
          const msg = await response.json()
          throw new Error(msg.error)
        }

        const data = await response.json()
        return data
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account) {
  //       // First-time login, save the `access_token`, its expiry and the `refresh_token`
  //       return {
  //         ...token,
  //         access_token: account.access_token,
  //         expires_at: account.expires_at,
  //         refresh_token: account.refresh_token,
  //       } as JWT
  //     } else if (Date.now() < token.expires_at * 1000) {
  //       // Subsequent logins, but the `access_token` is still valid
  //       return token
  //     } else {
  //       // Subsequent logins, but the `access_token` has expired, try to refresh it
  //       if (!token.refresh_token) throw new TypeError('Missing refresh_token')

  //       try {
  //         const response = await fetch('http://localhost:3000/api/token', {
  //           method: 'POST',
  //           body: new URLSearchParams({
  //             grant_type: 'refresh_token',
  //             refresh_token: token.refresh_token,
  //           }),
  //         })

  //         const tokensOrError = await response.json()

  //         if (!response.ok) throw tokensOrError

  //         const newTokens = tokensOrError as {
  //           access_token: string
  //           expires_in: number
  //           refresh_token?: string
  //         }

  //         token.access_token = newTokens.access_token
  //         token.expires_at = Math.floor(Date.now() / 1000 + newTokens.expires_in)
  //         // Some providers only issue refresh tokens once, so preserve if we did not get a new one
  //         if (newTokens.refresh_token) token.refresh_token = newTokens.refresh_token
  //         return token
  //       } catch (error) {
  //         console.error('Error refreshing access_token', error)
  //         // If we fail to refresh the token, return an error so we can handle it on the page
  //         token.error = 'RefreshTokenError'
  //         return token
  //       }
  //     }
  //   },

  //   async session({ session, token }) {
  //     session.error = token.error
  //     return session
  //   },
  // },
})

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token?: string
    error?: 'RefreshTokenError'
  }
}
