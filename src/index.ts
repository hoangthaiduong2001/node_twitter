import cors from 'cors'
import express from 'express'
// import '~/utils/fake'
// import '~/utils/s3'
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
app.listen(port, () => {
  console.log('listening on port 3000')
})
