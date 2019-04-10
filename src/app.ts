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
      type RootQuery {
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String): String
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
