import { Document } from 'mongoose'
import { IUserDocument } from './user.interface'

export interface IEventInput {
  title: string
  description: string
  price: number
  date: string
  creator: IUserDocument['_id']
}

interface IEvent extends IEventInput {
  creator: IUserDocument
  _id: Document['_id']
}

export interface IEventDocument extends Document, IEvent {
  _doc: IEvent
}
