export {} // hack to fix TSlint
import { Model } from 'mongoose'
import { IEventDocument, IEventInput } from './../../interfaces/event.interface'
import { IUserDocument, IUserInput } from './../../interfaces/user.interface'

const bcrypt = require('bcryptjs')

const Event: Model<IEventDocument> = require('./../../models/event.model')
const User: Model<IUserDocument> = require('./../../models/user.model')

const testUserID = '5caf9283fed8654707ebef4e'

const events = (eventsIds: IEventDocument['_id']): Promise<IEventDocument['_doc'][]> => {
  return Event.find({ _id: { $in: eventsIds } })
    .then((events: Array<IEventDocument>) => {
      return events.map((event: IEventDocument) => {
        return { ...event._doc, creator: user.bind(this, event.creator) }
      })
    })
    .catch((error: any) => {
      throw error
    })
}

const user = (userId: IUserDocument['_id']): Promise<IUserDocument['_doc']> => {
  return User.findById(userId)
    .then((user: IUserDocument) => {
      return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) }
    })
    .catch((error: any) => {
      throw error
    })
}

module.exports = {
  events: () => {
    return Event.find()
      .then((events: Array<IEventDocument>) => {
        return events.map((event: IEventDocument) => {
          return { ...event._doc, creator: user.bind(this, event.creator) }
        })
      })
      .catch((error: any) => {
        throw error
      })
  },
  createEvent: (args: { eventInput: IEventInput }) => {
    const event = new Event({ ...args.eventInput, creator: testUserID })
    let createdEvent = {} as IEventDocument
    return event
      .save()
      .then((result: IEventDocument) => {
        createdEvent._doc = { ...result._doc, creator: user.bind(this, result._doc.creator) }
        return User.findById(testUserID)
      })
      .then((user: IUserDocument) => {
        if (!user) {
          throw new Error('User not found')
        }
        user._doc.createdEvents.push(event.id)
        return user.save()
      })
      .then(
        (): IEventInput => {
          return createdEvent._doc
        }
      )
      .catch((error: any) => {
        throw error
      })
  },
  createUser: (args: { userInput: IUserInput }) => {
    const { email } = args.userInput
    return User.findOne({ email })
      .then((user: IUserDocument) => {
        if (user) {
          throw new Error('User exists already')
        }
        return bcrypt.hash(args.userInput.password, 12)
      })
      .then((hashPassword: string) => {
        const user = new User({
          email: args.userInput.email,
          password: hashPassword
        })

        return user.save()
      })
      .then((result: IUserDocument) => {
        return { email: result.email, password: null }
      })
      .catch((error: any) => {
        throw error
      })
  }
}
