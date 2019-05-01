import { IUserDocument } from '../../interfaces/user.interface'
import { IEventDocument } from '../../interfaces/event.interface'
import { dateToString } from '../../helpers/date'
import { IBookingDocument } from '../../interfaces/booking.interface'
import { User } from '../../models/user.model'
import { Event } from '../../models/event.model'

const DataLoader = require('dataloader')

const eventsLoader = new DataLoader(
  (eventsIds: Array<IEventDocument['_id']>): Promise<Array<IEventDocument['_doc']>> => {
    return fetchEvents(eventsIds)
  }
)

const usersLoader = new DataLoader(
  async (usersIds: Array<IUserDocument['_id']>): Promise<Array<IUserDocument['_doc']>> => {
    console.log(usersIds)
    return await User.find({ _id: { $in: usersIds } })
  }
)

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
    const event: IEventDocument = await eventsLoader.load(eventId.toString())
    return event
  } catch (e) {
    throw e
  }
}

export const fetchUser = async (userId: IUserDocument['_id']): Promise<IUserDocument['_doc']> => {
  try {
    const user: IUserDocument['_doc'] = await usersLoader.load(userId.toString())
    if (!user) {
      throw new Error('User does not exists')
    }
    const { _id, createdEvents, email } = user
    return { _id, email, createdEvents: () => eventsLoader.loadMany(createdEvents) }
  } catch (e) {
    throw e
  }
}
