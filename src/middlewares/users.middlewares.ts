import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
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

export const unfollowValidator = validate(
  checkSchema(
    {
      followed_user_id: followSchema
    },
    ['params']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decoded_authorization as TokenPayload
            const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
            const { password } = user as User
            if (!user) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            if (password !== hashPassword(value)) {
              throw new Error(USERS_MESSAGE.OLD_PASSWORD_NOT_MATCH)
            }
          }
        }
      },
      new_password: passwordSchema,
      confirm_new_password: confirmPasswordSchema
    },
    ['body']
  )
)
