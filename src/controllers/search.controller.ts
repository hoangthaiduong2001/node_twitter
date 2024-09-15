import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PeopleFollow } from '~/constants/enums'
import { SEARCH } from '~/constants/message'
import { SearchQuery } from '~/models/requests/Search.request'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id as string
  const search_type = req.query.search_type
  const people_follow = req.query.people_follow as PeopleFollow
  const result = await searchService.search({
    limit,
    page,
    content: req.query.content,
    user_id,
    search_type,
    people_follow
  })
  res.json({
    message: SEARCH.SEARCH_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
