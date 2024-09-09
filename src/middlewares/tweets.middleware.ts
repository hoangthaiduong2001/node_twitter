import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TweetAudience, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEETS_MESSAGE, USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'
import {
  audienceTweetValidatorSchema,
  contentTweetValidatorSchema,
  hashtagsTweetValidatorSchema,
  mediasTweetValidatorSchema,
  mentionsTweetValidatorSchema,
  parentIdTweetValidatorSchema,
  tweetLimitValidatorSchema,
  tweetPageValidatorSchema,
  tweetTdValidatorSchema,
  tweetTypeValidatorSchema,
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
    tweet_id: tweetTdValidatorSchema
  })
)

export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  const { user_id } = req.decoded_authorization as TokenPayload
  if (tweet.audience === TweetAudience.TwitterCircle) {
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      })
    }
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    })
    if (!author || author.verify === UserVerifyStatus.BANNED) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGE.USER_NOT_FOUND
      })
    }
    const isInTweetCircle = author.twitter_circle.some((user_circle_id) => user_circle_id.equals(user_id))
    if (!isInTweetCircle && !author._id.equals(user_id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: TWEETS_MESSAGE.TWEET_IS_NOT_PUBLIC
      })
    }
  }
  next()
}

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: tweetTypeValidatorSchema
    },
    ['query']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: tweetLimitValidatorSchema,
      page: tweetPageValidatorSchema
    },
    ['query']
  )
)
