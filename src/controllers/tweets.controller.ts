import { config } from 'dotenv'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enums'
import { TWEETS_MESSAGE } from '~/constants/message'
import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '~/models/requests/Tweet.request'
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
  const result = await tweetService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    users_view: result.user_views,
    updated_at: result.updated_at
  }
  return res.json({
    message: TWEETS_MESSAGE.GET_TWEET_SUCCESS,
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_type = req.query.tweet_type as TweetType
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweetChildren, total } = await tweetService.getTweetChildren({
    user_id,
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page
  })
  return res.json({
    message: TWEETS_MESSAGE.GET_TWEET_CHILDREN_SUCCESS,
    result: {
      tweetChildren,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await tweetService.getNewFeeds({ user_id, limit, page })
  return res.json({
    message: TWEETS_MESSAGE.GET_NEW_FEEDS_SUCCESS,
    result: {
      tweets: result.feeds,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
