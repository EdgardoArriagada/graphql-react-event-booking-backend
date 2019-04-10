import express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

interface Event {
  _id: string
  title: string
  description: string
  price: number
  date: string
}

const events: Array<Event> = []

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

      input EventInput {
        title: String
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'Sailing', 'All-Night Coding']
      },
      createEvent: (args: { name: string }) => {
        const eventName = args.name
        return eventName
      }
    },
    graphiql: true
  })
)

export default app
