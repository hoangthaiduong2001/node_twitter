import { config } from 'dotenv'
import { Request, Response } from 'express'
import { CONVERSATION } from '~/constants/message'
import { ConversationParam } from '~/models/requests/Conversation.request'
import conversationService from '~/services/conversations.services'
config()

export const conversationController = async (req: Request<ConversationParam>, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const result = await conversationService.getConversations({ receiver_id, sender_id, limit, page })
  return res.json({
    message: CONVERSATION.CONVERSATION_SUCCESS,
    result: {
      conversation: result.conversations,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
