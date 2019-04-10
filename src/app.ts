import express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('port', 3000)

app.get('/', (req, res) => {
  const message: string = 'Hello World@'
  res.send(message)
})
export default app
