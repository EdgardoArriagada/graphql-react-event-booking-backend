export {} // hack to fix TSlint
import { Model } from 'mongoose'
import { IUserDocument, IUserInput } from '../../interfaces/user.interface'

const bcrypt = require('bcryptjs')

const User: Model<IUserDocument> = require('./../../models/user.model')

module.exports = {
  createUser: async (args: { userInput: IUserInput }): Promise<IUserDocument['_doc']> => {
    try {
      const { email } = args.userInput
      const existingUser: IUserDocument = await User.findOne({ email })
      if (existingUser) {
        throw new Error('User exists already')
      }
      const hashPassword: string = await bcrypt.hash(args.userInput.password, 12)
      const newUser: IUserDocument = new User({
        email: args.userInput.email,
        password: hashPassword
      })
      const result: IUserDocument = await newUser.save()
      return {
        _id: result.id,
        email: result.email,
        password: null,
        createdEvents: null
      }
    } catch (e) {
      throw e
    }
  }
}
