import { config } from 'dotenv'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { LIKE_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { LikeReqBody, UnLikeByIdReqParams, UnLikeTweetReqParams } from '~/models/requests/Like.request'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'
config()

export const likeController = async (req: Request<ParamsDictionary, any, LikeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, req.body.tweet_id)
  return res.json({
    message: LIKE_MESSAGE.LIKE_TWEET_SUCCESS,
    data: result
  })
}

export const unLikeTweetController = async (req: Request<UnLikeTweetReqParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const tweet_id = req.params.tweet_id as string
  const result = await likeService.unLikeTweet(user_id, tweet_id)
  if (!result) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: LIKE_MESSAGE.LIKE_NOT_FOUND
    })
  }
  return res.json({
    message: LIKE_MESSAGE.UN_LIKE_TWEET_SUCCESS,
    data: result
  })
}

export const unLikeByIdController = async (req: Request<UnLikeByIdReqParams>, res: Response) => {
  const like_id = req.params.like_id as string
  const result = await likeService.unLikeById(like_id)
  return res.json({
    message: LIKE_MESSAGE.UN_LIKE_TWEET_SUCCESS,
    data: result
  })
}
