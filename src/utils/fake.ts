import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { RegistersReqBody } from '~/models/requests/User.requests'
import Follower from '~/models/schemas/Follower.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import tweetService from '~/services/tweets.services'
import { hashPassword } from './crypto'

const PASSWORD = 'Duongtt123@'
const MY_ID = new ObjectId('66ce95dd915b3b69be0d7348')
const USER_COUNT = 100
const createRandomUser = () => {
  const user: RegistersReqBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: new Date(faker.date.past().toISOString())
  }
  return user
}

const createRadomTweet = () => {
  const tweet: TweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.EveryOne,
    content: faker.lorem.paragraph({
      min: 10,
      max: 100
    }),
    hashtags: [],
    medias: [],
    mentions: [],
    parent_id: null
  }
  return tweet
}

const users: RegistersReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insertMultipleUsers = async (users: RegistersReqBody[]) => {
  console.log('create user...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.VERIFIED
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) => {
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
    })
  )
  console.log(`Followed ${result.length} user`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweet...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        tweetService.createTweet(id.toString(), createRadomTweet()),
        tweetService.createTweet(id.toString(), createRadomTweet())
      ])
      count += 2
      console.log(`Created ${count} tweet`)
    })
  )
  return result
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MY_ID), ids)
  insertMultipleTweets(ids)
})
