export {} // hack to fix TSlint
import { IEventDocument } from '../../interfaces/event.interface'
import { IBookingDocument } from '../../interfaces/booking.interface'
import { standarizeBooking, standarizeEvent } from './utils'
import { Booking } from '../../models/booking.model'
import { Event } from '../../models/event.model'
import { IAppRequest } from '../../middleware/is-auth.middleware'

module.exports = {
  bookings: async (args: null, req: IAppRequest): Promise<IBookingDocument['_doc'][]> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const bookings: Array<IBookingDocument> = await Booking.find({ user: req.userId })
      return bookings.map(
        (booking: IBookingDocument): IBookingDocument['_doc'] => {
          return standarizeBooking(booking)
        }
      )
    } catch (e) {
      throw e
    }
  },
  bookEvent: async (args: { eventId: IEventDocument['_id'] }, req: IAppRequest): Promise<IBookingDocument['_doc']> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const fetchedEvent: IEventDocument = await Event.findOne({ _id: args.eventId })
      const booking = new Booking({ user: req.userId, event: fetchedEvent._doc._id })
      const result = await booking.save()
      return standarizeBooking(result)
    } catch (e) {
      throw e
    }
  },
  cancelBooking: async (
    args: { bookingId: IBookingDocument['_id'] },
    req: IAppRequest
  ): Promise<IEventDocument['_doc']> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event')
      if (req.userId.toString() !== booking.user.toString()) {
        throw new Error('User not deleting its own booking')
      }
      const event: IEventDocument['_doc'] = standarizeEvent(booking.event)
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (e) {
      throw e
    }
  }
}
