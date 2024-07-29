import { ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { verifyToken } from '~/utils/jwt'

export const passwordSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  errorMessage: USERS_MESSAGE.PASSWORD_WRONG_FORMAT
}

export const confirmPasswordSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH_WITH_PASSWORD)
      }
      return true
    }
  },
  errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_WRONG_FORMAT
}

export const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: USERS_MESSAGE.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
        })
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decoded_forgot_password_token
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (user === null) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGE.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGE.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        req.decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        throw new ErrorWithStatus({
          message: capitalize((error as JsonWebTokenError).message),
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      return true
    }
  }
}

export const emailSchema: ParamSchema = {
  isEmail: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value: string) => {
      const isEmailExists = await userService.checkEmailExists(value)
      if (isEmailExists) {
        throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXISTS)
      }
      return true
    }
  }
}
