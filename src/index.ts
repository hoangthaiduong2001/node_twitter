import cors from 'cors'
import express from 'express'
// import '~/utils/fake'
// import '~/utils/s3'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { defaultErrorHandler } from './middlewares/error.middleware'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import mediasRouter from './routes/medias.routes'
import searchRouter from './routes/search.routes'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { initFolder } from './utils/file'

const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = 3000

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
initFolder()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/tweet', tweetsRouter)
app.use('/bookmark', bookmarksRouter)
app.use('/search', searchRouter)
app.use('/like', likesRouter)
app.use(defaultErrorHandler)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4000'
  }
})

const users: {
  [key: string]: { socket_id: string }
} = {}

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('message', (value) => {
    const receiver_socket_id = users[value.to].socket_id
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
httpServer.listen(port, () => {
  console.log('listening on port 3000')
})
