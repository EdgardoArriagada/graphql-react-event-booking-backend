import app from './app'
const mongoose = require('mongoose')

let server

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ddaar.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Conection SUCCESS')
    server = app.listen(app.get('port'), () => {
      console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`)
    })
  })
  .catch((error: any) => {
    console.log(error)
  })

export default server
