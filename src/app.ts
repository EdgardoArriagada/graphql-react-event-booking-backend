import express = require('express')
import { isAuth } from './middleware/is-auth.middleware'
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const app = express()

app.set('port', process.env.PORT || 3000)

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

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
