import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import {
  audienceTweetValidatorSchema,
  contentTweetValidatorSchema,
  hashtagsTweetValidatorSchema,
  mediasTweetValidatorSchema,
  mentionsTweetValidatorSchema,
  parentIdTweetValidatorSchema,
  typeTweetValidatorSchema
} from './const'

export const createTweetValidator = validate(
  checkSchema(
    {
      type: typeTweetValidatorSchema,
      audience: audienceTweetValidatorSchema,
      parent_id: parentIdTweetValidatorSchema,
      content: contentTweetValidatorSchema,
      hashtags: hashtagsTweetValidatorSchema,
      mentions: mentionsTweetValidatorSchema,
      medias: mediasTweetValidatorSchema
    },
    ['body']
  )
)
