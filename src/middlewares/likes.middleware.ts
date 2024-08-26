import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { LIKE_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const likeIdValidator = validate(
  checkSchema({
    like_id: {
      custom: {
        options: async (value: string, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: LIKE_MESSAGE.INVALID_LIKE_ID
            })
          }
          const like = await databaseService.likes.findOne({
            _id: new ObjectId(value)
          })
          if (!like) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: LIKE_MESSAGE.LIKE_ID_NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
