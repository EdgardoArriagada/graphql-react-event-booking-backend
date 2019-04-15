export {} // hack to fix TSlint
import { IEventDocument } from '../../interfaces/event.interface'
import { IBookingDocument } from '../../interfaces/booking.interface'
import { standarizeBooking, standarizeEvent } from './utils'
import { Booking } from '../../models/booking.model'
import { Event } from '../../models/event.model'

const testUserID = '5cb124f0c944961bb23937eb'

module.exports = {
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
