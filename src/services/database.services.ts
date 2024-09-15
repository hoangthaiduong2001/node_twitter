import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Follower from '~/models/schemas/Follower.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Like from '~/models/schemas/Like.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import User from '~/models/schemas/User.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dtne5bp.mongodb.net/?appName=Cluster0`
//`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dtne5bp.mongodb.net/?appName=Cluster0`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const exists = await this.users.indexExists(['token_1', 'exp_1'])
    if (!exists) {
      this.refreshToken.createIndex({ token: 1 })
      this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexVideoStatus() {
    const exists = await this.users.indexExists('name_1')
    if (!exists) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }

  async indexFollowers() {
    const exists = await this.users.indexExists('user_id_1_followed_user_id_1')
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWER_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEET_COLLECTION as string)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_HASHTAG_COLLECTION as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_BOOKMARK_COLLECTION as string)
  }

  get likes(): Collection<Like> {
    return this.db.collection(process.env.DB_LIKE_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
