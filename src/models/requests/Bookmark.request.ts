export interface BookmarkReqBody {
  tweet_id: string
}

export interface UnBookmarkTweetReqParams {
  tweet_id?: string
}

export interface UnBookmarkByIdReqParams {
  bookmark_id?: string
}
