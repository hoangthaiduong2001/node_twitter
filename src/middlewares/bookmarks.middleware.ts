import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const bookmarkIdValidator = validate(
  checkSchema({
    bookmark_id: {
      isMongoId: {
        errorMessage: BOOKMARK_MESSAGE.INVALID_BOOKMARK_ID
      },
      custom: {
        options: async (value: string, { req }) => {
          const bookmark = await databaseService.bookmarks.findOne({
            _id: new ObjectId(value)
          })
          if (!bookmark) {
            throw new Error(BOOKMARK_MESSAGE.BOOKMARK_ID_NOT_FOUND)
          }
          return true
        }
      }
    }
  })
)
