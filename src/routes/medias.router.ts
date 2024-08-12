import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'
import { handleRequestHandler } from '~/utils/handler'

const mediasRouter = Router()

mediasRouter.post('/upload-single-image', handleRequestHandler(uploadSingleImageController))

export default mediasRouter
