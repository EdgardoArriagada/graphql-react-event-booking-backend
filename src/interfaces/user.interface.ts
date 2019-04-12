import { Document } from 'mongoose'

export interface IUserInput {
  email: string
  password?: string
}

interface IUser extends IUserInput {
  _id: Document['_id']
  createdEvents: Array<string>
}

export interface IUserDocument extends IUser, Document {
  _doc: IUser
}
