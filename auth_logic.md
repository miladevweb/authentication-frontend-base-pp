```json
POST /token
{
    "token": "<refresh_token>"
}
```

```typescript
/* /token */
app.post('/token', async (req, res) => {
  const { token } = req.body

  // Step 1: Validate the refresh token
  const dbToken = await prisma.refreshToken.findUnique({ where: { token } })

  // Check if the token exists and if it has expired
  if (!dbToken || new Date() > dbToken.expiresAt) {
    return res.sendStatus(403) // Token expired or invalid
  }

  // Step 2: Verify the refresh token
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) // Token verification failed

    // Step 3: Generate a new access token
    const newAccessToken = generateAccessToken({ userId: user.userId })

    // Optional: (Step 4) Issue a new refresh token
    const newRefreshToken = generateRefreshToken(user.userId)
    // Update the database with the new refresh token and reset the expiration
    await prisma.refreshToken.update({
      where: { token }, // Find the existing token to update
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
      },
    })

    // Step 5: Send new tokens to the client
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  })
})
```

<details>
  <summary>Database Schema</summary>

```javascript
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql" // or your preferred database
url      = env("DATABASE_URL")
}

model User {
id       Int          @id @default(autoincrement())
username String       @unique
password String
refreshTokens RefreshToken[]
}

model RefreshToken {
id       Int       @id @default(autoincrement())
token    String    @unique
userId   Int
user     User      @relation(fields: [userId], references: [id])
}
```

</details>

<details>
  <summary>Backend Logic</summary>

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
```

```typescript
// index.js
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

dotenv.config()
const prisma = new PrismaClient()
const app = express()
app.use(express.json())

// Helper functions for token generation
// from 15 minutes to 1 hour
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

// from 1 to 6 months
const generateRefreshToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET)
  return token
}

// User registration
app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashedPassword,
    },
  })
  res.status(201).json({ userId: user.id })
})

// User login
app.post('/login', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.body.username },
  })

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(403).send('Invalid username or password')
  }

  const accessToken = generateAccessToken({ userId: user.id })
  const refreshToken = generateRefreshToken(user.id)

  // Store the refresh token in the database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  })

  res.json({ accessToken, refreshToken })
})

// Token refresh endpoint
app.post('/token', async (req, res) => {
  const { token } = req.body

  // Step 1: Validate the refresh token
  const dbToken = await prisma.refreshToken.findUnique({ where: { token } })

  // Check if the token exists and if it has expired
  if (!dbToken || new Date() > dbToken.expiresAt) {
    return res.sendStatus(403) // Token expired or invalid
  }

  // Step 2: Verify the refresh token
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) // Token verification failed

    // Step 3: Generate a new access token
    const newAccessToken = generateAccessToken({ userId: user.userId })

    // Optional: (Step 4) Issue a new refresh token
    const newRefreshToken = generateRefreshToken(user.userId)
    // Update the database with the new refresh token and reset the expiration
    await prisma.refreshToken.update({
      where: { token }, // Find the existing token to update
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
      },
    })

    // Step 5: Send new tokens to the client
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  })
})

// Logout endpoint
app.delete('/logout', async (req, res) => {
  const { token } = req.body
  await prisma.refreshToken.deleteMany({ where: { token } })
  res.sendStatus(204)
})

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})

// Start the server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

</details>

<br>

# **Storage of Tokens**

> ### Access Tokens:

Not Typically Stored: Access tokens are usually not stored in the database. They are short-lived and can be passed between the client and server as needed. Instead, they are typically stored in the client's local storage or memory (e.g., in the browser's session or cookies).

> ### Refresh Tokens:

Stored in Database: Refresh tokens should be stored in the database along with their expiration times. This allows for better management, such as revoking them when a user logs out or when a refresh token needs to be invalidated.

- To create a token (access or refresh), we needa sign it with a string, It's highly recommended to use a secret key to sign the token and this key is usually stored in the environment variables.
