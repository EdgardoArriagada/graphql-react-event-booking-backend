const authResolver = require('./auth')
const eventsResolver = require('./events')
const bookingResolver = require('./booking')

export const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver
}
