import { MediaType } from './enums'

export interface IPlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface Media {
  url: string
  type: MediaType
}

export interface ViewsType {
  guest_views: number
  user_views: number
}
