import { Model } from 'mongoose'
import { IEventDocument, IEventInput } from '../../interfaces/event.interface'
import { standarizeEvent } from './utils'
import { IUserDocument } from '../../interfaces/user.interface'

const Event: Model<IEventDocument> = require('./../../models/event.model')
const User: Model<IUserDocument> = require('./../../models/user.model')

const testUserID = '5cb124f0c944961bb23937eb'

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
  }
}
