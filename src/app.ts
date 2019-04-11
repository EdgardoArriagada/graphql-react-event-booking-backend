import express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

import { IEvent, IEventInput } from './interfaces/event.interface'
import { IUser, IUserInput } from './interfaces/user.interface'

const Event = require('./models/event.model')
const User = require('./models/user.model')

const app = express()

app.set('port', 3000)

app.use(bodyParser.json())

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
      }

      type User {
        _id: ID!
        email: String!
        password: String
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
            return events.map((event: { _doc: IEvent }) => {
              return { ...event._doc }
            })
          })
          .catch((error: any) => {
            throw error
          })
      },
      createEvent: (args: { eventInput: IEventInput }) => {
        return new Event({ ...args.eventInput })
          .save()
          .then(
            (result: { _doc: IEvent }): IEvent => {
              return { ...result._doc }
            }
          )
          .catch((error: any) => {
            throw error
          })
      },
      createUser: (args: { userInput: IUserInput }) => {
        const { email } = args.userInput
        return User.findOne({ email })
          .then((user: IUser) => {
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
          .then(
            (result: { _doc: IUser }): IUser => {
              return { ...result._doc, password: null }
            }
          )
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
