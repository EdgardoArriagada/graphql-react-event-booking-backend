export interface IEventInput {
  title: string
  description: string
  price: number
  date: string
}
export interface IEvent extends IEventInput {
  _id: string
}
