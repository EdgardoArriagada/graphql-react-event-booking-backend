import { Document } from 'mongoose'

export interface IEventInput {
  title: string
  description: string
  price: number
  date: string
  creator: string
}

interface IEvent extends IEventInput {
  _id: string
}

export interface IEventDocument extends Document {
  _doc: IEvent
}
