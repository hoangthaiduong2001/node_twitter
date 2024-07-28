import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, handleRequestHandler(registerController))
usersRouter.post('/login', loginValidator, handleRequestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, handleRequestHandler(logoutController))
usersRouter.post('/email-verify', emailVerifyTokenValidator, handleRequestHandler(emailVerifyController))
usersRouter.post('/resend-email-verify', accessTokenValidator, handleRequestHandler(emailVerifyController))
usersRouter.post('/forgot-password', forgotPasswordValidator, handleRequestHandler(forgotPasswordController))

export default usersRouter
