import { Document } from 'mongoose'
import { IUserDocument } from './user.interface'
import { IEventDocument } from './event.interface'

export interface IBooking {
  _id: Document['_id']
  event: IEventDocument['_id']
  user: IUserDocument['_id']
  createdAt: string
  updatedAt: string
}

export interface IBookingInput {
  event: IBooking['event']
  user: IBooking['user']
}

export interface IBookingDocument extends Document, IBooking {
  _doc: IBooking
}
