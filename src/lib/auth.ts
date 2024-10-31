import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Github from 'next-auth/providers/github'
// import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Github({
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        } as JWT
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token')

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          // We can send params with a GET request in its endpoint and with a POST request in the body field with URLSearchParams
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token!,
            }),
          })

          const tokensOrError = await response.json()

          if (!response.ok) throw tokensOrError

          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }

          token.access_token = newTokens.access_token
          token.expires_at = Math.floor(Date.now() / 1000 + newTokens.expires_in)
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token) token.refresh_token = newTokens.refresh_token
          return token
        } catch (error) {
          console.error('Error refreshing access_token', error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError'
          return token
        }
      }
    },

    async session({ session, token }) {
      session.error = token.error
      return session
    },
  },
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
