import { config } from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { ObjectId } from 'mongodb'
import { Server } from 'socket.io'
import Conversation from '~/models/schemas/Conversation.schema'
import databaseService from '~/services/database.services'
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

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  socket.on('message', async (value) => {
    const receiver_socket_id = users[value.to]?.socket_id
    if (!receiver_socket_id) return
    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(value.from),
        receiver_id: new ObjectId(value.to),
        content: value.content
      })
    )
    socket.to(receiver_socket_id).emit('receive message', {
      content: value.content,
      from: user_id
    })
    console.log(value)
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
  })
})
