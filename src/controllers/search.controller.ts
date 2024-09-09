import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SEARCH } from '~/constants/message'
import { SearchQuery } from '~/models/requests/Search.request'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await searchService.search({ limit, page, content: req.query.content })
  res.json({
    message: SEARCH.SEARCH_SUCCESS,
    result
  })
}
