import { IConversation } from '~/constants/type'
import databaseService from './database.services'

class ConversationService {
  async getConversations({ receiver_id, sender_id, limit, page }: IConversation) {
    const query = {
      $or: [
        {
          receiver_id: new Object(receiver_id),
          sender_id: new Object(sender_id)
        },
        {
          receiver_id: new Object(sender_id),
          sender_id: new Object(receiver_id)
        }
      ]
    }
    const conversations = await databaseService.conversations
      .find(query)
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await databaseService.conversations.countDocuments(query)
    return {
      conversations,
      total
    }
  }
}

const conversationService = new ConversationService()
export default conversationService
