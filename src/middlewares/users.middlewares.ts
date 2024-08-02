import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import { validate } from '~/utils/validation'
import {
  authorizationSchema,
  bioSchema,
  confirmPasswordSchema,
  dateOfBirthSchema,
  emailForgotPassword,
  emailLoginSchema,
  emailSchema,
  emailVerifyTokenSchema,
  followSchema,
  forgotPasswordTokenSchema,
  imageSchema,
  locationSchema,
  nameSchema,
  passwordSchema,
  refreshTokenSchema,
  usernameSchema,
  websiteSchema
} from './const'

export const loginValidator = validate(
  checkSchema(
    {
      email: emailLoginSchema,
      password: passwordSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      dateOfBirth: dateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: authorizationSchema
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: refreshTokenSchema
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: emailVerifyTokenSchema
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: emailForgotPassword
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify !== UserVerifyStatus.VERIFIED) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGE.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  return next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true,
        notEmpty: undefined
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      },
      bio: bioSchema,
      location: locationSchema,
      website: websiteSchema,
      username: usernameSchema,
      avatar: imageSchema,
      cover_photo: imageSchema
    },
    ['body']
  )
)

export const followValidator = validate(
  checkSchema(
    {
      followed_user_id: followSchema
    },
    ['body']
  )
)
