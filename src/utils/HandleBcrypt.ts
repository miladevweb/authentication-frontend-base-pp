import { compare, hash } from 'bcrypt'

export const encryptPassword = async (password: string) => {
  const passwordHash = await hash(password, 10)
  return passwordHash
}

export const comparePassword = async (password: string, passwordHash: string) => {
  const isValid = await compare(password, passwordHash)
  return isValid
}
