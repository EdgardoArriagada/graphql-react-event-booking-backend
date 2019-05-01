import { Document } from 'mongoose'
import { IEvent } from './event.interface'

interface IUser {
  _id: Document['_id']
  email: string
  password?: string
  createdEvents: Array<IEvent> | (() => Array<IEvent>)
}

export interface IUserInput {
  email: IUser['email']
  password?: IUser['password']
}

export interface IAuthData {
  userId: string
  token: string
  tokenExpiration: number
}

export interface IUserDocument extends IUser, Document {
  _doc: IUser
}
