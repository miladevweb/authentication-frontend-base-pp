import type { JwtPayload } from 'jsonwebtoken'

export type FormDataValues = {
  [key: string]: string
}

export interface Payload extends JwtPayload {
  userId: string
}

export enum ErrorReason {
  NO_TOKEN,
  INVALID_TOKEN,
  USER_NOT_FOUND,
}

export type User = {
  id: string
  name: string
  email: string
  image: string
  access: string
  refresh: string
}
