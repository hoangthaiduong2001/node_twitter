import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controller'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middleware'
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

tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  handleRequestHandler(audienceValidator),
  handleRequestHandler(getTweetChildrenController)
)

tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(getNewFeedsController)
)

export default tweetsRouter
