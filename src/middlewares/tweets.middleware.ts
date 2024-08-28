import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'
import {
  audienceTweetValidatorSchema,
  contentTweetValidatorSchema,
  hashtagsTweetValidatorSchema,
  mediasTweetValidatorSchema,
  mentionsTweetValidatorSchema,
  parentIdTweetValidatorSchema,
  typeTweetValidatorSchema
} from './const'

export const createTweetValidator = validate(
  checkSchema(
    {
      type: typeTweetValidatorSchema,
      audience: audienceTweetValidatorSchema,
      parent_id: parentIdTweetValidatorSchema,
      content: contentTweetValidatorSchema,
      hashtags: hashtagsTweetValidatorSchema,
      mentions: mentionsTweetValidatorSchema,
      medias: mediasTweetValidatorSchema
    },
    ['body']
  )
)

export const tweetIdValidator = validate(
  checkSchema({
    tweet_id: {
      custom: {
        options: async (value: string, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: TWEETS_MESSAGE.INVALID_TWEET_ID
            })
          }
          const tweet = await databaseService.tweets.findOne({
            _id: new ObjectId(value)
          })
          if (!tweet) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: TWEETS_MESSAGE.TWEET_ID_NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)
