export interface LikeReqBody {
  tweet_id: string
}

export interface UnLikeTweetReqParams {
  tweet_id?: string
}

export interface UnLikeByIdReqParams {
  like_id?: string
}
