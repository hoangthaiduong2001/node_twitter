import { createHash } from 'crypto'

export const sha256 = (value: string) => {
  return createHash('sha256').update(value).digest('hex')
}

export const hashPassword = (password: string) => {
  return sha256(password + process.env.PASSWORD_SECRET)
}
