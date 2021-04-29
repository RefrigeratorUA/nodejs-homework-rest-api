const passport = require('passport')
const { httpStatusCodes } = require('../helpers/httpstatuscodes.cjs')
require('../config/passport.cjs')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return next({
        status: httpStatusCodes.FORBIDDEN,
        message: 'Forbidden',
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
