export {} // hack to fix TSlint
import { Schema, Model } from 'mongoose'
import { IUserDocument } from '../interfaces/user.interface'

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

export const User: Model<IUserDocument> = mongoose.model('User', userSchema)
