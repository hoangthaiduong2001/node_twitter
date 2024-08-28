import { config } from 'dotenv'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { BookmarkReqBody, UnBookmarkByIdReqParams, UnBookmarkTweetReqParams } from '~/models/requests/Bookmark.request'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'
config()

export const bookmarkController = async (req: Request<ParamsDictionary, any, BookmarkReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGE.BOOKMARK_TWEET_SUCCESS,
    data: result
  })
}

export const unBookmarkTweetController = async (req: Request<UnBookmarkTweetReqParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.params.tweet_id as string
  const result = await bookmarkService.unBookmarkTweet(user_id, tweet_id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: BOOKMARK_MESSAGE.BOOKMARK_NOT_FOUND
    })
  }
  return res.json({
    message: BOOKMARK_MESSAGE.UN_BOOKMARK_TWEET_SUCCESS,
    data: result
  })
}

export const unBookmarkByIdController = async (req: Request<UnBookmarkByIdReqParams>, res: Response) => {
  const bookmark_id = req.params.bookmark_id as string
  const result = await bookmarkService.unBookmarkById(bookmark_id)
  return res.json({
    message: BOOKMARK_MESSAGE.UN_BOOKMARK_TWEET_SUCCESS,
    data: result
  })
}
