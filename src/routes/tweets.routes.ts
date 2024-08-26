import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controller'
import { createTweetValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const tweetsRouter = Router()

tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  handleRequestHandler(createTweetController)
)

export default tweetsRouter
