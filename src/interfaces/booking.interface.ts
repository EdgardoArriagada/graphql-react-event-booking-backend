import { Document } from 'mongoose'
import { IUserDocument } from './user.interface'
import { IEventDocument } from './event.interface'

export interface IBookingInput {
  event: IEventDocument['_id']
  user: IUserDocument['_id']
}

interface IBooking extends IBookingInput {
  _id: Document['_id']
  createdAt: string
  updatedAt: string
}

export interface IBookingDocument extends Document, IBooking {
  _doc: IBooking
}
