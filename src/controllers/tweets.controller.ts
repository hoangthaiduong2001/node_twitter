import { config } from 'dotenv'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGE } from '~/constants/message'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetService from '~/services/tweets.services'
config()

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.createTweet(user_id, req.body)
  return res.json({
    message: TWEETS_MESSAGE.CREATE_TWEET_SUCCESS,
    data: result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get tweet success'
  })
}
