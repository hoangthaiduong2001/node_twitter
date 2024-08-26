import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import { validate } from '~/utils/validation'
import {
  authorizationValidatorSchema,
  bioValidatorSchema,
  confirmPasswordValidatorSchema,
  dateOfBirthValidatorSchema,
  emailForgotPasswordValidatorSchema,
  emailLoginValidatorSchema,
  emailValidatorSchema,
  emailVerifyTokenValidatorSchema,
  followValidatorSchema,
  forgotPasswordTokenValidatorSchema,
  imageValidatorSchema,
  locationValidatorSchema,
  nameValidatorSchema,
  oldPasswordValidatorSchema,
  passwordValidatorSchema,
  refreshTokenValidatorSchema,
  usernameValidatorSchema,
  websiteValidatorSchema
} from './const'

export const loginValidator = validate(
  checkSchema(
    {
      email: emailLoginValidatorSchema,
      password: passwordValidatorSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameValidatorSchema,
      email: emailValidatorSchema,
      password: passwordValidatorSchema,
      confirmPassword: confirmPasswordValidatorSchema,
      dateOfBirth: dateOfBirthValidatorSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: authorizationValidatorSchema
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: refreshTokenValidatorSchema
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: emailVerifyTokenValidatorSchema
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: emailForgotPasswordValidatorSchema
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenValidatorSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordValidatorSchema,
      confirm_password: confirmPasswordValidatorSchema,
      forgot_password_token: forgotPasswordTokenValidatorSchema
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
        ...nameValidatorSchema,
        optional: true,
        notEmpty: undefined
      },
      date_of_birth: {
        ...dateOfBirthValidatorSchema,
        optional: true
      },
      bio: bioValidatorSchema,
      location: locationValidatorSchema,
      website: websiteValidatorSchema,
      username: usernameValidatorSchema,
      avatar: imageValidatorSchema,
      cover_photo: imageValidatorSchema
    },
    ['body']
  )
)

export const followValidator = validate(
  checkSchema(
    {
      followed_user_id: followValidatorSchema
    },
    ['body']
  )
)

export const unfollowValidator = validate(
  checkSchema(
    {
      followed_user_id: followValidatorSchema
    },
    ['params']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: oldPasswordValidatorSchema,
      new_password: passwordValidatorSchema,
      confirm_new_password: confirmPasswordValidatorSchema
    },
    ['body']
  )
)
