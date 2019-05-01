import { IUserDocument } from '../../interfaces/user.interface'
import { IEventDocument } from '../../interfaces/event.interface'
import { dateToString } from '../../helpers/date'
import { IBookingDocument } from '../../interfaces/booking.interface'
import { User } from '../../models/user.model'
import { Event } from '../../models/event.model'

export const standarizeEvent = ({
  _id,
  date,
  price,
  description,
  title,
  creator
}: IEventDocument['_doc']): IEventDocument['_doc'] => {
  return {
    _id,
    title,
    description,
    date: dateToString(date),
    price,
    creator: fetchUser.bind(this, creator)
  }
}

export const standarizeBooking = ({
  _id,
  user,
  event,
  createdAt,
  updatedAt
}: IBookingDocument['_doc']): IBookingDocument['_doc'] => {
  return {
    _id,
    user: fetchUser.bind(this, user),
    event: fetchEvent.bind(this, event),
    createdAt: dateToString(createdAt),
    updatedAt: dateToString(updatedAt)
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
    const user: IUserDocument['_doc'] = await User.findById(userId)
    if (!user) {
      throw new Error('User does not exists')
    }
    const { _id, createdEvents, email } = user
    return { _id, email, createdEvents: fetchEvents.bind(this, createdEvents) }
  } catch (e) {
    throw e
  }
}
