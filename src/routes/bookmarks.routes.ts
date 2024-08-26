import { Router } from 'express'
import {
  bookmarkController,
  unBookmarkByIdController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const bookmarksRouter = Router()

bookmarksRouter.post('', accessTokenValidator, verifiedUserValidator, handleRequestHandler(bookmarkController))
bookmarksRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(unBookmarkTweetController)
)
bookmarksRouter.delete(
  '/:bookmark_id',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(unBookmarkByIdController)
)

export default bookmarksRouter
