import { Request } from 'express'
import { ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize, isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGE, USERS_MESSAGE } from '~/constants/message'
import { Media } from '~/constants/type'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload, UpdateMeReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { convertEnumToArray } from '~/utils/common'
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

export const passwordValidatorSchema: ParamSchema = {
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

export const confirmPasswordValidatorSchema: ParamSchema = {
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
        throw new Error(USERS_MESSAGE.CONFIRM_PASSWORD_NOT_MATCH_WITH_PASSWORD)
      }
      return true
    }
  },
  errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_WRONG_FORMAT
}

export const forgotPasswordTokenValidatorSchema: ParamSchema = {
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

export const emailValidatorSchema: ParamSchema = {
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

export const emailForgotPasswordValidatorSchema: ParamSchema = {
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

export const nameValidatorSchema: ParamSchema = {
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

export const oldPasswordValidatorSchema: ParamSchema = {
  ...passwordValidatorSchema,
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
}

export const dateOfBirthValidatorSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USERS_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601
  }
}

export const bioValidatorSchema: ParamSchema = {
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

export const locationValidatorSchema: ParamSchema = {
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

export const websiteValidatorSchema: ParamSchema = {
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

export const usernameValidatorSchema: ParamSchema = {
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

export const avatarValidatorSchema: ParamSchema = {
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

export const imageValidatorSchema: ParamSchema = {
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

export const emailLoginValidatorSchema: ParamSchema = {
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

export const refreshTokenValidatorSchema: ParamSchema = {
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

export const emailVerifyTokenValidatorSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      console.log(value)
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

export const authorizationValidatorSchema: ParamSchema = {
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

export const followValidatorSchema: ParamSchema = {
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

/*-------------Tweet-------------*/
const tweetType = convertEnumToArray(TweetType)
const audienceType = convertEnumToArray(TweetAudience)
const mediaTypes = convertEnumToArray(MediaType)

export const audienceTweetValidatorSchema: ParamSchema = {
  isIn: {
    options: [audienceType],
    errorMessage: TWEETS_MESSAGE.INVALID_AUDIENCE
  }
}

export const typeTweetValidatorSchema: ParamSchema = {
  isIn: {
    options: [tweetType],
    errorMessage: TWEETS_MESSAGE.INVALID_TYPE
  }
}

export const parentIdTweetValidatorSchema: ParamSchema = {
  custom: {
    options: (value: string, { req }) => {
      const type = req.body.type as TweetType
      if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
        throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
      }
      if (type === TweetType.Tweet && value !== null) {
        throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_NULL)
      }
      return true
    }
  }
}

export const contentTweetValidatorSchema: ParamSchema = {
  isString: true,
  custom: {
    options: (value: string, { req }) => {
      const type = req.body.type as TweetType
      const hashtags = req.body.hashtags as string[]
      const mentions = req.body.mentions as string[]
      if (
        [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
        value === '' &&
        isEmpty(hashtags) &&
        isEmpty(mentions)
      ) {
        throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
      }
      if (type === TweetType.Retweet && value !== '') {
        throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_EMPTY_STRING)
      }
      return true
    }
  }
}

export const hashtagsTweetValidatorSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: (value: string[], { req }) => {
      if (value.some((item: string) => typeof item !== 'string')) {
        throw new Error(TWEETS_MESSAGE.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
      }
      return true
    }
  }
}

export const mentionsTweetValidatorSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: (value: string[], { req }) => {
      if (value.some((item: string) => !ObjectId.isValid(item))) {
        throw new Error(TWEETS_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
      }
      return true
    }
  }
}

export const mediasTweetValidatorSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: (value: Media[], { req }) => {
      if (value.some((item: Media) => typeof item.url !== 'string' || !mediaTypes.includes(item.type))) {
        throw new Error(TWEETS_MESSAGE.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
      }
      return true
    }
  }
}
