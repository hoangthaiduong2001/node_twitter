import { IPlainObject } from '~/constants/type'

export const convertEnumToArray = (enums: IPlainObject) => {
  return Object.values(enums) as string[]
}
