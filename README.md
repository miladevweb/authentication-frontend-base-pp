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
