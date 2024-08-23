import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(uploadImageController)
)

mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(uploadVideoController)
)

mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(uploadVideoHLSController)
)

mediasRouter.post(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  handleRequestHandler(videoStatusController)
)

export default mediasRouter
