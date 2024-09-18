import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { userIdValidatorSchema } from './const'

export const conversationValidator = validate(
  checkSchema(
    {
      receiver_id: userIdValidatorSchema
    },
    ['params']
  )
)
