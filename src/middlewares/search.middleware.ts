import { checkSchema } from 'express-validator'
import { PeopleFollow, SearchQueryType } from '~/constants/enums'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content must be string'
        }
      },
      search_type: {
        optional: true,
        isIn: {
          options: [Object.values(SearchQueryType)]
        },
        errorMessage: 'Search type must be  one of SearchQueryType'
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: 'People follow must be 0 or 1'
        }
      }
    },
    ['query']
  )
)
