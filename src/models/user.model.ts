export {} // hack to fix TSlint
import { Schema } from 'mongoose'

const mongoose = require('mongoose')

const required = true // syntaxt helper

const userSchema: Schema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
