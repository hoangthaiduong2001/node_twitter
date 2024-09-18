import { config } from 'dotenv'
import { Request } from 'express'
import jwt, { JsonWebTokenError, Secret, SignOptions } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: Secret
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}
export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  return true
}
