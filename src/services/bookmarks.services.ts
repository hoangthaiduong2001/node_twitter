import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class BookmarkService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweet_id) },
      {
        $setOnInsert: {
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
  async unBookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
  async unBookmarkById(bookmark_id: string) {
    const result = await databaseService.bookmarks.findOneAndDelete({
      _id: new ObjectId(bookmark_id)
    })
    return result
  }
}
const bookmarkService = new BookmarkService()
export default bookmarkService
