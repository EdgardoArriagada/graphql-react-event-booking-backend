export {} // hack to fix TSlint
import { IUserDocument, IUserInput, IAuthData } from '../../interfaces/user.interface'
import { User } from '../../models/user.model'
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')

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
  },
  login: async ({ email, password }: IUserInput): Promise<IAuthData> => {
    const user: IUserDocument = await User.findOne({ email })
    if (!user) {
      throw new Error('User does not exist!')
    }

    const isEqualPassword = await bcrypt.compare(password, user._doc.password)
    if (!isEqualPassword) {
      throw new Error('Password is incorrect!')
    }
    const token = await jwt.sign({ userId: user.id, email }, 'somesupersecretkey', {
      expiresIn: '1h'
    })
    return { userId: user.id, token, tokenExpiration: 1 }
  }
}
