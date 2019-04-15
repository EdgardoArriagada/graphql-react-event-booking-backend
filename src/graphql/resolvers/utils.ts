import { IUserDocument } from '../../interfaces/user.interface'
import { IEventDocument } from '../../interfaces/event.interface'
import { Model } from 'mongoose'
import { dateToString } from '../../helpers/date'
import { IBookingDocument } from '../../interfaces/booking.interface'

const Event: Model<IEventDocument> = require('./../../models/event.model')
const User: Model<IUserDocument> = require('./../../models/user.model')
export const standarizeEvent = (event: IEventDocument): IEventDocument['_doc'] => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: fetchUser.bind(this, event.creator)
  }
}

export const standarizeBooking = (booking: IBookingDocument): IBookingDocument['_doc'] => {
  return {
    ...booking._doc,
    user: fetchUser.bind(this, booking._doc.user),
    event: fetchEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}
export const fetchEvents = async (eventsIds: IEventDocument['_id'][]): Promise<IEventDocument['_doc'][]> => {
  try {
    const events: Array<IEventDocument> = await Event.find({ _id: { $in: eventsIds } })
    return events.map((event: IEventDocument) => {
      return standarizeEvent(event)
    })
  } catch (e) {
    throw e
  }
}

export const fetchEvent = async (eventId: IEventDocument['_id']): Promise<IEventDocument['_doc']> => {
  try {
    const event: IEventDocument = await Event.findById(eventId)
    return standarizeEvent(event)
  } catch (e) {
    throw e
  }
}

export const fetchUser = async (userId: IUserDocument['_id']): Promise<IUserDocument['_doc']> => {
  try {
    const user: IUserDocument = await User.findById(userId)
    return { ...user._doc, createdEvents: fetchEvents.bind(this, user._doc.createdEvents) }
  } catch (e) {
    throw e
  }
}
