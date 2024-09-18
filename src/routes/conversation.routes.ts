import { Router } from 'express'
import { conversationController } from '~/controllers/conversations.controller'
import { conversationValidator } from '~/middlewares/conversations.middleware'
import { paginationValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const conversationRouter = Router()

conversationRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  conversationValidator,
  handleRequestHandler(conversationController)
)

export default conversationRouter
