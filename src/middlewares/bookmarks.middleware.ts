import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { bookmarkIdValidatorSchema } from './const'

export const bookmarkIdValidator = validate(
  checkSchema({
    bookmark_id: bookmarkIdValidatorSchema
  })
)
