import { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const API_SERVER_BASE_URL = process.env.API_SERVER_BASE_URL

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },

      // Handles the signup and login
      async authorize(credentials) {
        if (credentials === null) return null

        const tokenResponse = await fetch(API_SERVER_BASE_URL + '/login', {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          headers: { 'Content-Type': 'application/json' },
        })

        if (!tokenResponse.ok) {
          const error = await tokenResponse.json()
          console.log(error.message, '🔥 tokenresponse')
          return null
        }

        // Get User Info
        const { access, refresh } = await tokenResponse.json()
        console.log({ access, refresh })

        const userResponse = await fetch(API_SERVER_BASE_URL + '/user', {
          headers: { Authorization: 'Bearer ' + access },
        })

        if (!userResponse.ok) {
          const error = await userResponse.json()
          console.log(error.message, '🔥 userresponse')
          return null
        }
        const user = await userResponse.json()
        return {
          ...user,
          access,
          refresh,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
