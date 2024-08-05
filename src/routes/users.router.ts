import { Router } from 'express'
import {
  changePasswordController,
  deleteUserController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  getMyProfileController,
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  unFollowController,
  updateUserProfileController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterKeysBodyUpdateUser } from '~/middlewares/const'
import { filterMiddleware } from '~/middlewares/filter.middleware'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
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
usersRouter.get('/me', accessTokenValidator, handleRequestHandler(getMyProfileController))
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>(filterKeysBodyUpdateUser),
  handleRequestHandler(updateUserProfileController)
)
usersRouter.delete('/delete-user', accessTokenValidator, handleRequestHandler(deleteUserController))
usersRouter.get('/:username', handleRequestHandler(getUserProfileController))
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  handleRequestHandler(followController)
)
usersRouter.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  handleRequestHandler(unFollowController)
)
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  handleRequestHandler(changePasswordController)
)

export default usersRouter
