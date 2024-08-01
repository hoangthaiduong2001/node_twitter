import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/errors/Errors'

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)
    const error = validationResult(req)
    if (error.isEmpty()) {
      return next()
    }
    const errorObject = error.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      entityError.errors[key] = errorObject[key]
      if (entityError instanceof ErrorWithStatus && entityError.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(errorObject[key])
      }
    }
    next(entityError)
  }
}
