import { Document } from 'mongoose'
// the order of the users or events fetched have to match usersIds or eventsIds in order to dataLoader to work
interface WithId {
  _id: Document['_id']
}

export function sortById<T extends WithId>(document: Array<T>, ids: Array<Document['_id']>): Array<T> {
  return document.sort((a, b) => {
    return ids.indexOf(a._id.toString() - ids.indexOf(b._id.toString()))
  })
}
