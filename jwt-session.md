En el callback jwt:

Si user está presente (lo que significa que es la primera vez que el usuario se autentica), extraes los datos del usuario y los guardas en el token. El token es el JWT que se almacena de manera segura en el navegador (por ejemplo, en cookies).
Estos datos del token estarán disponibles en cada solicitud que el usuario realice, ya que se incluirán automáticamente en la cookie si usas la estrategia JWT de NextAuth.

En el callback session:

Cuando el cliente solicita la sesión (usando useSession() o una API similar), los datos del token se pasan al objeto session.
Los datos del token (como id, email, access_token, refresh_token) se asignan a session.user, lo que te permite acceder a estos datos en el lado del cliente, dentro de tu aplicación.

```typescript
callbacks: {
  async jwt({ token, user }) {
    // Si es la primera vez que el usuario se autentica, agregamos sus datos al token
    if (user) {
      // Agregar los datos relevantes al JWT
      token.id = user.id;            // ID del usuario
      token.email = user.email;      // Email del usuario
      token.access_token = user.access; // Access token de la API
      token.refresh_token = user.refresh; // Refresh token
    }

    // Puedes agregar lógica adicional aquí para manejar la renovación de tokens si es necesario
    return token;
  },

  async session({ session, token }) {
    // Transferimos los datos del JWT a la sesión
    session.user.id = token.id; // ID del usuario
    session.user.email = token.email; // Email del usuario
    session.user.access_token = token.access_token; // Access token
    session.user.refresh_token = token.refresh_token; // Refresh token

    return session;
  },
}
```

¿Qué almacenar en el JWT?
En general, debes almacenar en el JWT solo información que sea relevante para la autenticación y autorización del usuario. Por ejemplo:

ID del usuario (user.id): Esto es útil para saber quién es el usuario cuando haces solicitudes a tu API.
Correo electrónico (user.email): Puede ser útil para mostrar información del usuario en la interfaz.
Access token (access_token): Si tu API usa un token de acceso para autenticar solicitudes, deberías guardarlo aquí. Puedes usarlo para hacer solicitudes autenticadas.
Refresh token (refresh_token): Si necesitas renovar el access token después de que expire, guarda el refresh token para poder hacer solicitudes de renovación.
Sin embargo, evita almacenar información sensible como contraseñas, números de tarjeta de crédito o cualquier otra información privada que no sea estrictamente necesaria.

¿Dónde se guardan estos datos?
En el callback jwt, los datos se guardan dentro del JWT, que se guarda en una cookie (por defecto) o en un almacenamiento de tu elección, dependiendo de cómo configures tu sesión (cookie, base de datos, etc.).

En el callback session, estos datos se transfieren al objeto session, el cual es accesible desde el cliente. Por ejemplo, si usas useSession(), puedes acceder a session.user para obtener información como el id, email, access_token, etc.

## Resumen
Callback jwt: Guardas los datos relevantes del usuario en el JWT (por ejemplo, access_token, refresh_token, user.id, user.email).
Callback session: Transfieres esos datos del JWT a la sesión (en session.user), para que puedas usarlos en tu aplicación.
