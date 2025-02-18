import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { likeIdValidatorSchema } from './const'

export const likeIdValidator = validate(
  checkSchema(
    {
      like_id: likeIdValidatorSchema
    },
    ['params']
  )
)
