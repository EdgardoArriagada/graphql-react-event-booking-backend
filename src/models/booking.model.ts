export {} // hack to fix TSlint
import { Schema } from 'mongoose'

const mongoose = require('mongoose')

const required = true // syntaxt helper

const bookingSchema: Schema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)
