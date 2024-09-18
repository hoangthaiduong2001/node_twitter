import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { contentSearchValidatorSchema, peopleFollowValidatorSchema, searchTypeValidatorSchema } from './const'

export const searchValidator = validate(
  checkSchema(
    {
      content: contentSearchValidatorSchema,
      search_type: searchTypeValidatorSchema,
      people_follow: peopleFollowValidatorSchema
    },
    ['query']
  )
)
