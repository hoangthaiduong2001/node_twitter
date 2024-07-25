export const USERS_MESSAGE = {
  VALIDATION: 'Validation error',

  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',

  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number nad 1 symbol',
  PASSWORD_WRONG_FORMAT: 'Format password is wrong',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number nad 1 symbol',
  CONFIRM_PASSWORD_NOT_MATCH_WITH_PASSWORD: 'Password confirmation does not match password',
  CONFIRM_PASSWORD_WRONG_FORMAT: 'Format confirm password is wrong',

  DATE_OF_BIRTH_MUST_BE_ISO8601: 'date of birth must be ISO8601',

  USER_NOT_FOUND: 'User not found',

  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',

  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_INVALID: 'Refresh token invalid',
  REFRESH_TOKEN_USED_OR_NOT_EXISTS: 'Refresh token is used or not exists',

  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',

  LOGOUT_SUCCESS: 'Logout success'
} as const
