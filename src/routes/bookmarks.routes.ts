import { Router } from 'express'
import {
  bookmarkController,
  unBookmarkByIdController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controller'
import { bookmarkIdValidator } from '~/middlewares/bookmarks.middleware'
import { tweetIdValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const bookmarksRouter = Router()

bookmarksRouter.post('', accessTokenValidator, verifiedUserValidator, handleRequestHandler(bookmarkController))
bookmarksRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  handleRequestHandler(unBookmarkTweetController)
)
bookmarksRouter.delete(
  '/:bookmark_id',
  accessTokenValidator,
  verifiedUserValidator,
  bookmarkIdValidator,
  handleRequestHandler(unBookmarkByIdController)
)

export default bookmarksRouter
