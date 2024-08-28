import { Router } from 'express'
import { likeController, unLikeByIdController, unLikeTweetController } from '~/controllers/likes.controller'
import { likeIdValidator } from '~/middlewares/likes.middleware'
import { tweetIdValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const likesRouter = Router()

likesRouter.post('', accessTokenValidator, verifiedUserValidator, handleRequestHandler(likeController))
likesRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  handleRequestHandler(unLikeTweetController)
)
likesRouter.delete(
  '/:like_id',
  accessTokenValidator,
  verifiedUserValidator,
  likeIdValidator,
  handleRequestHandler(unLikeByIdController)
)

export default likesRouter
