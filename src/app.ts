import express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
import { Model } from 'mongoose'

import { IEventInput, IEventDocument } from './interfaces/event.interface'
import { IUserDocument, IUserInput } from './interfaces/user.interface'

const Event: Model<IEventDocument> = require('./models/event.model')
const User: Model<IUserDocument> = require('./models/user.model')

const testUserID = '5caf9283fed8654707ebef4e'

const app = express()

app.set('port', 3000)

app.use(bodyParser.json())

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

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input EventInput {
        title: String
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events: any) => {
            return events.map((event: { _doc: IEventDocument }) => {
              return { ...event._doc }
            })
          })
          .catch((error: any) => {
            throw error
          })
      },
      createEvent: (args: { eventInput: IEventInput }) => {
        const event = new Event({ ...args.eventInput, creator: testUserID })
        let createdEvent: IEventDocument
        return event
          .save()
          .then((result: IEventDocument) => {
            createdEvent = result
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
    },
    graphiql: true
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ddaar.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Conection SUCCESS')
  })
  .catch((error: any) => {
    console.log(error)
  })

export default app
