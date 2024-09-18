import cors from 'cors'
import express from 'express'
// import '~/utils/fake'
// import '~/utils/s3'
import '~/utils/indexDatabaseService'
import '~/utils/socket'
import { defaultErrorHandler } from './middlewares/error.middleware'
import bookmarksRouter from './routes/bookmarks.routes'
import conversationRouter from './routes/conversation.routes'
import likesRouter from './routes/likes.routes'
import mediasRouter from './routes/medias.routes'
import searchRouter from './routes/search.routes'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import usersRouter from './routes/users.routes'
import { port } from './utils/common'
import { initFolder } from './utils/file'
import { httpServer } from './utils/socket'

initFolder()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/tweet', tweetsRouter)
app.use('/bookmark', bookmarksRouter)
app.use('/search', searchRouter)
app.use('/like', likesRouter)
app.use('/conversation', conversationRouter)

app.use(defaultErrorHandler)

httpServer.listen(port, () => {
  console.log('listening on port 3000')
})
