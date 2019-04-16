import express = require('express')
import { isAuth } from './middleware/is-auth.middleware'
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const app = express()

app.set('port', 3000)

app.use(bodyParser.json())

const graphqlSchema = require('./graphql/schema/index')
import { rootResolver } from './graphql/resolvers/index'

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: rootResolver,
    graphiql: true
  })
)

export default app
