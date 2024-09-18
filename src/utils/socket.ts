import { config } from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { ObjectId } from 'mongodb'
import { Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import Conversation from '~/models/schemas/Conversation.schema'
import databaseService from '~/services/database.services'
import { verifyAccessToken } from './jwt'
config()

type UserSocket = {
  [key: string]: { socket_id: string }
}

const app = express()
export const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL
  }
})
const users: UserSocket = {}

io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.VERIFIED) {
      new ErrorWithStatus({
        message: USERS_MESSAGE.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    socket.handshake.auth.decoded_authorization = decoded_authorization
    socket.handshake.auth.access_token = access_token
    next()
  } catch (error) {
    next({
      message: 'Authorization',
      name: 'AuthorizationError',
      data: error
    })
  }
})

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  users[user_id] = {
    socket_id: socket.id
  }
  socket.use(async (packet, next) => {
    const { access_token } = socket.handshake.auth
    try {
      await verifyAccessToken(access_token)
      next()
    } catch (error) {
      next(new Error('Authorization'))
    }
  })
  socket.on('error', (error) => {
    if (error.message === 'Authorization') {
      socket.disconnect()
    }
  })
  socket.on('message', async (value) => {
    const receiver_socket_id = users[value.to]?.socket_id
    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(value.from),
        receiver_id: new ObjectId(value.to),
        content: value.content
      })
    )
    if (receiver_socket_id) {
      socket.to(receiver_socket_id).emit('receive message', {
        content: value.content,
        from: user_id
      })
    }
    console.log(value)
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
  })
})
