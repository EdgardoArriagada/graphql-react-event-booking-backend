export {} // hack to fix TSlint
import { Schema, Model } from 'mongoose'
import { IEventDocument } from '../interfaces/event.interface'

const mongoose = require('mongoose')

const required = true // syntaxt helper

const eventSchema: Schema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const Event: Model<IEventDocument> = mongoose.model('Event', eventSchema)
