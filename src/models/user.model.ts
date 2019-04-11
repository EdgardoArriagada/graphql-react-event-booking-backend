export {} // hack to fix TSlint

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const required = true // syntaxt helper

const userSchema = new Schema({
  email: {
    type: String,
    required
  },
  password: {
    type: String,
    required
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
