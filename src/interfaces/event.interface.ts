import { Document } from 'mongoose'
import { IUserDocument } from './user.interface'

export interface IEvent {
  _id: Document['_id']
  title: string
  description: string
  price: number
  date: string
  creator: IUserDocument
}

export interface IEventInput {
  title: IEvent['title']
  description: IEvent['description']
  price: IEvent['price']
  date: IEvent['date']
  creator: IUserDocument['_id']
}

export interface IEventDocument extends Document, IEvent {
  _doc: IEvent
}
