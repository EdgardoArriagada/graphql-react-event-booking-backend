import express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('port', 3000)

app.use(bodyParser.json())

app.get('/', ({ res }) => {
  const message: string = 'Hello World@'
  res.send(message)
})
export default app
