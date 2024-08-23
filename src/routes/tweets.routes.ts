import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const tweetsRouter = Router()

tweetsRouter.post('/', accessTokenValidator, verifiedUserValidator, handleRequestHandler(createTweetController))

export default tweetsRouter
