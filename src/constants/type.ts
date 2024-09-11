import { MediaType, PeopleFollow, SearchQueryType, TweetType } from './enums'

export interface IPlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface Media {
  url: string
  type: MediaType
}

export interface ViewsType {
  guest_views: number
  user_views: number
  updated_at: Date
}

export interface ITweetChildren {
  user_id?: string
  tweet_id: string
  tweet_type: TweetType
  limit: number
  page: number
}

export interface IGetFeeds {
  user_id: string
  limit: number
  page: number
}

export interface ISearchQuery {
  limit: number
  page: number
  content: string
  user_id: string
  search_type?: SearchQueryType
  people_follow?: PeopleFollow
}
