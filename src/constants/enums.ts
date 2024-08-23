export enum UserVerifyStatus {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  BANNED = 'banned'
}

export enum TokenType {
  AccessToken = 'AccessToken',
  RefreshToken = 'RefreshToken',
  ForgotPasswordToken = 'ForgotPasswordToken',
  EmailVerifyToken = 'EmailVerifyToken'
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
  VideoHLS = 'VideoHLS'
}

export enum EncodingStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Success = 'Success',
  Failed = 'Failed'
}

export enum TweetType {
  Tweet = 'Tweet',
  Retweet = 'Retweet',
  Comment = 'Comment',
  QuoteTweet = 'Quote tweet'
}

export enum TweetAudience {
  EveryOne = 'Every one',
  TwitterCircle = 'Twitter circle'
}
