import { SearchQueryType } from '~/constants/enums'
import { Pagination } from './Tweet.request'

export interface SearchQuery extends Pagination {
  content: string
  search_type: SearchQueryType
  people_follow: string
}
