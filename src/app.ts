import express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')

const app = express()

app.set('port', 3000)

app.use(bodyParser.json())

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
)

export default app
