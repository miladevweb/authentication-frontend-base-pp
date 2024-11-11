import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email().endsWith('@gmail.com', 'This is not a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export const RegisterSchema = z.object({
  email: z.string().email().endsWith('@gmail.com', 'This is not a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  name: z.string().min(4, 'Name must be at least 4 characters'),
  thumbnail: z.instanceof(File).refine((file) => file.type.startsWith('image/'), 'It must be an image'),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
