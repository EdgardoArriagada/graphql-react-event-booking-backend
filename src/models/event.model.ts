export {} // hack to fix TSlint

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const required = true // syntaxt helper

const eventSchema = new Schema({
  title: {
    type: String,
    required
  },
  description: {
    type: String,
    required
  },
  price: {
    type: Number,
    required
  },
  date: {
    type: Date,
    required
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Event', eventSchema)
