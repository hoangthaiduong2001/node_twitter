import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import {
  audienceTweetSchema,
  contentTweetSchema,
  hashtagsTweetSchema,
  mediasTweetSchema,
  mentionsTweetSchema,
  parentIdTweetSchema,
  typeTweetSchema
} from './const'

export const createTweetValidator = validate(
  checkSchema(
    {
      type: typeTweetSchema,
      audience: audienceTweetSchema,
      parent_id: parentIdTweetSchema,
      content: contentTweetSchema,
      hashtags: hashtagsTweetSchema,
      mentions: mentionsTweetSchema,
      medias: mediasTweetSchema
    },
    ['body']
  )
)
