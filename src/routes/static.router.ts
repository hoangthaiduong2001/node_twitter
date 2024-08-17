import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controller'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video-stream/:name', serveVideoController)

export default staticRouter
