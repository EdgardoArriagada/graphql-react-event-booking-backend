import express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

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
    rootValue: {}
  })
)

export default app
