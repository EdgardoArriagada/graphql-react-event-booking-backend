export {} // hack to fix TSlint
import { Model } from 'mongoose'
import { IEventDocument, IEventInput } from '../../interfaces/event.interface'
import { IUserDocument, IUserInput } from '../../interfaces/user.interface'
import { IBookingDocument } from '../../interfaces/booking.interface'
import { dateToString } from '../../helpers/date'

const bcrypt = require('bcryptjs')

const Event: Model<IEventDocument> = require('./../../models/event.model')
const User: Model<IUserDocument> = require('./../../models/user.model')
const Booking: Model<IBookingDocument> = require('./../../models/booking.model')

const testUserID = '5cb124f0c944961bb23937eb'

const standarizeEvent = (event: IEventDocument): IEventDocument['_doc'] => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: fetchUser.bind(this, event.creator)
  }
}

const standarizeBooking = (booking: IBookingDocument): IBookingDocument['_doc'] => {
  return {
    ...booking._doc,
    user: fetchUser.bind(this, booking._doc.user),
    event: fetchEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  }
}

const fetchEvents = async (eventsIds: IEventDocument['_id'][]): Promise<IEventDocument['_doc'][]> => {
  try {
    const events: Array<IEventDocument> = await Event.find({ _id: { $in: eventsIds } })
    return events.map((event: IEventDocument) => {
      return standarizeEvent(event)
    })
  } catch (e) {
    throw e
  }
}

const fetchEvent = async (eventId: IEventDocument['_id']): Promise<IEventDocument['_doc']> => {
  try {
    const event: IEventDocument = await Event.findById(eventId)
    return standarizeEvent(event)
  } catch (e) {
    throw e
  }
}

const fetchUser = async (userId: IUserDocument['_id']): Promise<IUserDocument['_doc']> => {
  try {
    const user: IUserDocument = await User.findById(userId)
    return { ...user._doc, createdEvents: fetchEvents.bind(this, user._doc.createdEvents) }
  } catch (e) {
    throw e
  }
}

module.exports = {
  events: async (): Promise<IEventDocument['_doc'][]> => {
    try {
      const events: Array<IEventDocument> = await Event.find()
      return events.map(
        (event: IEventDocument): IEventDocument['_doc'] => {
          return standarizeEvent(event)
        }
      )
    } catch (e) {
      throw e
    }
  },
  bookings: async (): Promise<IBookingDocument['_doc'][]> => {
    try {
      const bookings = await Booking.find()
      return bookings.map(
        (booking: IBookingDocument): IBookingDocument['_doc'] => {
          return standarizeBooking(booking)
        }
      )
    } catch (e) {
      throw e
    }
  },
  createEvent: async (args: { eventInput: IEventInput }): Promise<IEventDocument['_doc']> => {
    try {
      const event = new Event({ ...args.eventInput, creator: testUserID })
      const result = await event.save()
      const createdEvent: IEventDocument['_doc'] = standarizeEvent(result)
      const userCreator = await User.findById(testUserID)
      if (!userCreator) {
        throw new Error('User not found')
      }
      userCreator._doc.createdEvents.push(event.id)
      await userCreator.save()

      return createdEvent
    } catch (e) {
      throw e
    }
  },
  createUser: async (args: { userInput: IUserInput }): Promise<IUserDocument['_doc']> => {
    try {
      const { email } = args.userInput
      const existingUser: IUserDocument = await User.findOne({ email })
      if (existingUser) {
        throw new Error('User exists already')
      }
      const hashPassword: string = await bcrypt.hash(args.userInput.password, 12)
      const newUser: IUserDocument = new User({
        email: args.userInput.email,
        password: hashPassword
      })
      const result: IUserDocument = await newUser.save()
      return {
        _id: result.id,
        email: result.email,
        password: null,
        createdEvents: null
      }
    } catch (e) {
      throw e
    }
  },
  bookEvent: async (args: { eventId: IEventDocument['_id'] }): Promise<IBookingDocument['_doc']> => {
    try {
      const fetchedEvent: IEventDocument = await Event.findOne({ _id: args.eventId })
      const booking = new Booking({ user: testUserID, event: fetchedEvent._doc._id })
      const result = await booking.save()
      return standarizeBooking(result)
    } catch (e) {
      throw e
    }
  },
  cancelBooking: async (args: { bookingId: IBookingDocument['_id'] }): Promise<IEventDocument['_doc']> => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event')
      const event: IEventDocument['_doc'] = standarizeEvent(booking.event)
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (e) {
      throw e
    }
  }
}
