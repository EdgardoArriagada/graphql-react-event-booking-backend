import { Document } from 'mongoose'

export interface IUserInput {
  email: string
  password?: string
}

interface IUser extends IUserInput {
  _id: string
  createdEvents: Array<string>
}

export interface IUserDocument extends IUserInput, Document {
  _doc: IUser
}
