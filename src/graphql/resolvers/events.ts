import { IEventDocument, IEventInput, IEvent } from '../../interfaces/event.interface'
import { standarizeEvent } from './utils'
import { User } from '../../models/user.model'
import { Event } from '../../models/event.model'
import { IAppRequest } from '../../middleware/is-auth.middleware'

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
  createEvent: async (args: { eventInput: IEventInput }, req: IAppRequest): Promise<IEventDocument['_doc']> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const event = new Event({ ...args.eventInput, creator: req.userId })
      const result = await event.save()
      const createdEvent: IEventDocument['_doc'] = standarizeEvent(result)
      const userCreator = await User.findById(req.userId)
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
  modifyEvent: async (args: { modifyEventInput: IEvent }, req: IAppRequest): Promise<IEventDocument['_doc']> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const { _id } = args.modifyEventInput
      const eventToModify = await Event.findById(_id).populate('creator')

      if (req.userId.toString() !== eventToModify.creator._id.toString()) {
        throw new Error('User not modifing its own event')
      }
      const modifiedEvent = await Event.updateOne({ _id }, { $set: { ...args.modifyEventInput } })
      return modifiedEvent
    } catch (e) {
      throw e
    }
  }
}
