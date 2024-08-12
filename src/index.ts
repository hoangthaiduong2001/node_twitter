import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
import { initFolder } from './utils/file'
const app = express()
const port = 3000

databaseService.connect()
initFolder()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log('listening on port 3000')
})
