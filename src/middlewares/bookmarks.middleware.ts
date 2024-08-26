import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const bookmarkIdValidator = validate(
  checkSchema({
    bookmark_id: {
      custom: {
        options: async (value: string, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: BOOKMARK_MESSAGE.INVALID_BOOKMARK_ID
            })
          }
          const bookmark = await databaseService.bookmarks.findOne({
            _id: new ObjectId(value)
          })
          if (!bookmark) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: BOOKMARK_MESSAGE.BOOKMARK_ID_NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
