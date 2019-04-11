export interface IUserInput {
  email: string
  password?: string
}
export interface IUser extends IUserInput {
  createdEvents: Array<string>
  _id: string
}
