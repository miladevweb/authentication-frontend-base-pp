<br>

# <div align="center">NextAuth GitHub Authentication</div>

<details>
  <summary>NextAuth GitHub Configuration</summary>

```typescript
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user,user:email',
        },
      },
      profile(profile) {
        // Aquí puedes modificar el perfil del usuario si es necesario
        return profile
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Guarda el refresh token cuando el usuario inicia sesión
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token // Guarda el refresh token si está disponible
      }
      return token
    },
    async session({ session, token }) {
      // Añade el access token a la sesión
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken // Añade el refresh token a la sesión
      return session
    },
  },
  pages: {
    signIn: '/auth/signin', // Página personalizada de inicio de sesión
  },
})
```

</details>

<details>
  <summary>Sign In Page</summary>

```tsx
import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div>
      <h1>Inicia sesión</h1>
      <button onClick={() => signIn('github')}>Iniciar sesión con GitHub</button>
    </div>
  )
}
```

</details>

<details>

  <summary>Handle Refresh Token</summary>

```tsx
async function refreshAccessToken(token) {
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        refresh_token: token.refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    const refreshedTokens = await res.json()

    if (!res.ok) throw new Error(refreshedTokens.error)

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Guardar el nuevo refresh token
    }
  } catch (error) {
    console.error(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
```

</details>

<details>
  <summary>Use the refresh token in the callback</summary>

```typescript
async jwt({ token, user, account }) {
// Lógica para verificar si el access token está cerca de expirar
// y llama a refreshAccessToken si es necesario

return token;
}
```

</details>

<details>
  <summary>Difference between Account, Session and Token</summary>

- **account:** Información sobre la cuenta del usuario (como tokens) durante el proceso de autenticación.

- **session:** Información que se devuelve al cliente después de iniciar sesión y que representa la sesión activa.

- **token:** El JWT que se utiliza para manejar la autenticación en el servidor. Puede contener información sobre la sesión y se gestiona de manera interna.

</details>

<details>
  <summary>Authorize Credential Method - Credentials Provider</summary>

- `authorize` method in the Credentials Provider returns either a user object (if the credentials are valid) or null (if they are invalid).

- We should set the user object in session unless you wanna use OAuth providers, they do it by default.

```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface User {
  id: string
  name: string
  email: string
}

interface Credentials {
  username: string
  password: string
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // We should set the user object in session unless you wanna use OAuth providers, they do it by default.
      async authorize(credentials: Credentials): Promise<User | null> {
        const user = await fetchUserFromDatabase(credentials.username, credentials.password)

        if (user) {
          return user // Valid credentials, return user object
        } else {
          return null // Invalid credentials
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // Save user id in token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id // Add user id to session
      }
      return session
    },
  },
})

// Mock function to simulate fetching user from a database
async function fetchUserFromDatabase(username: string, password: string): Promise<User | null> {
  // Replace this with your actual database logic
  const mockUser: User = { id: '1', name: 'John Doe', email: 'john@example.com' }

  if (username === 'john' && password === 'password') {
    return mockUser // Simulate valid user
  }

  return null // Simulate invalid user
}
```

<br>

We can use the `session` callback to add the user ID to the session object.

```typescript
callbacks: {
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id; // Include user ID in session
      session.user.name = token.name; // Include user name if available
    }
    return session;
  }
}
```

And we can

</details>
