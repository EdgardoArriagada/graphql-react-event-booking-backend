import { IEventDocument, IEventInput } from '../../interfaces/event.interface'
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
      const event = new Event({ ...args.eventInput, creator: testUserID })
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
  }
}
