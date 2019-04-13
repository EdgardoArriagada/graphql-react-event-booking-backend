export {} // hack to fix TSlint
import { Model } from 'mongoose'
import { IEventDocument, IEventInput } from './../../interfaces/event.interface'
import { IUserDocument, IUserInput } from './../../interfaces/user.interface'

const bcrypt = require('bcryptjs')

const Event: Model<IEventDocument> = require('./../../models/event.model')
const User: Model<IUserDocument> = require('./../../models/user.model')

const testUserID = '5cb124f0c944961bb23937eb'

const events = async (eventsIds: IEventDocument['_id']): Promise<IEventDocument['_doc'][]> => {
  try {
    const events: Array<IEventDocument> = await Event.find({ _id: { $in: eventsIds } })
    return events.map((event: IEventDocument) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      }
    })
  } catch (e) {
    throw e
  }
}

const user = async (userId: IUserDocument['_id']): Promise<IUserDocument['_doc']> => {
  try {
    const user: IUserDocument = await User.findById(userId)
    return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
  } catch (e) {
    throw e
  }
}

module.exports = {
  events: async () => {
    try {
      const events: Array<IEventDocument> = await Event.find()
      return events.map((event: IEventDocument) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator)
        }
      })
    } catch (e) {
      throw e
    }
  },
  createEvent: async (args: { eventInput: IEventInput }) => {
    try {
      const event = new Event({ ...args.eventInput, creator: testUserID })
      let createdEvent = {} as IEventDocument
      const result = await event.save()
      createdEvent._doc = {
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      }
      const userCreator = await User.findById(testUserID)
      if (!userCreator) {
        throw new Error('User not found')
      }
      userCreator._doc.createdEvents.push(event.id)
      await userCreator.save()

      return createdEvent._doc
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
  }
}
