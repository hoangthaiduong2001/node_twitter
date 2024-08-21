import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

export interface LoginReqBody {
  user_id: ObjectId
}

export interface RegistersReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: Date
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}

export interface IUserVerify {
  user_id: string
  verify: UserVerifyStatus
}

export interface IRefreshToken extends IUserVerify {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface GetProfileReqParams {
  username?: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface UnFollowReqParams {
  followed_user_id?: string
}

export interface ChangePasswordReqBody {
  new_password: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
