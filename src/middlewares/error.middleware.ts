import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/errors/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  const finalError: any = {}
  Object.getOwnPropertyNames(err).forEach((key) => {
    if (
      !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
      !Object.getOwnPropertyDescriptor(err, key)?.writable
    ) {
      return
    }
    finalError[key] = err[key]
  })
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: finalError.message,
    errorInfo: omit(finalError, ['stack'])
  })
}
