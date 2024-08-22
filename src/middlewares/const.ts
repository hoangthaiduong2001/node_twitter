import { Request } from 'express'
import { ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { REGEX_USERNAME } from './regex'

export const filterKeysBodyUpdateUser: Array<keyof UpdateMeReqBody> = [
  'name',
  'date_of_birth',
  'bio',
  'location',
  'website',
  'username',
  'avatar',
  'cover_photo'
]

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
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
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
      minLength: 6,
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
        console.log('req.body.password', req.body.password)
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

export const emailForgotPassword: ParamSchema = {
  isEmail: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const user = await databaseService.users.findOne({ email: value })
      if (user === null) {
        throw new Error(USERS_MESSAGE.USER_NOT_FOUND)
      }
      req.user = user
      return true
    }
  }
}

export const nameSchema: ParamSchema = {
  isString: {
    errorMessage: USERS_MESSAGE.NAME_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.NAME_IS_REQUIRED
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: USERS_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_100
  }
}

export const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USERS_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601
  }
}

export const bioSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.BIO_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 200
    },
    errorMessage: USERS_MESSAGE.BIO_LENGTH_MUST_BE_FROM_1_TO_200
  }
}

export const locationSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.LOCATION_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 200
    },
    errorMessage: USERS_MESSAGE.LOCATION_LENGTH_MUST_BE_FROM_1_TO_200
  }
}

export const websiteSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.WEBSITE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 200
    },
    errorMessage: USERS_MESSAGE.WEBSITE_LENGTH_MUST_BE_FROM_1_TO_200
  }
}

export const usernameSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.USERNAME_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      const user = await databaseService.users.findOne({ username: value })
      if (!REGEX_USERNAME.test(value)) {
        throw Error(USERS_MESSAGE.USERNAME_INVALID)
      }
      if (user) {
        throw Error(USERS_MESSAGE.USERNAME_EXISTED)
      }
    }
  }
}

export const avatarSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.IMAGE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: USERS_MESSAGE.IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400
  }
}

export const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGE.IMAGE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: USERS_MESSAGE.IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400
  }
}

export const emailLoginSchema: ParamSchema = {
  isEmail: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
  },
  notEmpty: {
    errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const user = await databaseService.users.findOne({
        email: value,
        password: hashPassword(req.body.password)
      })
      if (user === null) {
        throw new Error(USERS_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
      }
      req.user = user
    }
  }
}

export const refreshTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: USERS_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
        })
      }
      try {
        const [decoded_refresh_token, refresh_token] = await Promise.all([
          verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
          databaseService.refreshToken.findOne({ token: value })
        ])
        if (refresh_token === null) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGE.REFRESH_TOKEN_USED_OR_NOT_EXISTS,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_refresh_token = decoded_refresh_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize(error.message),
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}

export const emailVerifyTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: USERS_MESSAGE.EMAIL_VERIFY_TOKEN_IS_REQUIRED
        })
      }
      try {
        const decoded_email_verify_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
        })
        ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
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

export const authorizationSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      const access_token = (value || '').split(' ')[1]
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
        ;(req as Request).decoded_authorization = decoded_authorization
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

export const followSchema: ParamSchema = {
  custom: {
    options: async (value: string, { req }) => {
      const followed_user = await databaseService.users.findOne({
        _id: new ObjectId(value)
      })
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGE.INVALID_FOLLOWED_USER_ID,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      if (followed_user === null) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGE.USER_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }
  }
}
