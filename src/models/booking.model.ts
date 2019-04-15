export {} // hack to fix TSlint
import { Schema, Model } from 'mongoose'
import { IBookingDocument } from '../interfaces/booking.interface'

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

export const Booking: Model<IBookingDocument> = mongoose.model('Booking', bookingSchema)
