import { Router } from 'express'
import { createTweetController, getTweetController } from '~/controllers/tweets.controller'
import { audienceValidator, createTweetValidator, tweetIdValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const tweetsRouter = Router()

tweetsRouter.post(
  '',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  handleRequestHandler(createTweetController)
)

tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  handleRequestHandler(audienceValidator),
  handleRequestHandler(getTweetController)
)

export default tweetsRouter
