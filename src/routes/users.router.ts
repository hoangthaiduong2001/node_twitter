import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  updateUserProfileController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { handleRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, handleRequestHandler(registerController))
usersRouter.post('/login', loginValidator, handleRequestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, handleRequestHandler(logoutController))
usersRouter.post('/email-verify', emailVerifyTokenValidator, handleRequestHandler(emailVerifyController))
usersRouter.post('/resend-email-verify', accessTokenValidator, handleRequestHandler(emailVerifyController))
usersRouter.post('/forgot-password', forgotPasswordValidator, handleRequestHandler(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordTokenValidator,
  handleRequestHandler(verifyForgotPasswordTokenController)
)
usersRouter.post('/reset-password', resetPasswordValidator, handleRequestHandler(resetPasswordController))
usersRouter.get('/me', accessTokenValidator, handleRequestHandler(getUserProfileController))
usersRouter.patch('/me', accessTokenValidator, updateMeValidator, handleRequestHandler(updateUserProfileController))

export default usersRouter
